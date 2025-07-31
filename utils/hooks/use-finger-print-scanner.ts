import { useState, useEffect } from 'react';

interface FingerprintMessage {
  workmsg: number;
  image?: string;
  data1?: string;
  retmsg?: number;
}

interface CaptureResult {
  image: string;
  fingerprintData: string;
}

const useFingerprint = () => {
  const [state, setState] = useState<string>('Conectando...');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:21187/fps');
    setWs(socket);

    socket.onopen = () => setState('Listo');
    socket.onclose = () => setState('Error: Conexión cerrada');
    socket.onerror = () => setState('Error en WebSocket');

    return () => {
      socket.close();
    };
  }, []);

  const sendCommand = (cmd: Record<string, string>) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(cmd));
    } else {
      setState('Error: No conectado');
    }
  };

  const captureFingerprint = (): Promise<CaptureResult> => {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject('Error: No conectado');
        return;
      }

      let image: string | null = null;
      let data: string | null = null;

      const timeout = setTimeout(() => {
        ws.removeEventListener('message', onMessage);
        reject('Timeout al capturar huella');
      }, 5000);

      const onMessage = (event: MessageEvent) => {
        const msg: FingerprintMessage = JSON.parse(event.data);
        if (msg.workmsg === 7 && msg.image !== 'null') {
          image = `data:image/png;base64,${msg.image}`;
        }
        if (msg.workmsg === 5 && msg.data1 !== 'null') {
          data = msg.data1 ?? null;
        }

        if (image && data) {
          clearTimeout(timeout);
          ws.removeEventListener('message', onMessage);
          resolve({ image, fingerprintData: data });
        }
      };

      ws.addEventListener('message', onMessage);
      sendCommand({ cmd: 'capture', data1: '1', data2: '0' });
    });
  };

  const matchFingerprint = (data1: string, data2: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject('Error: No conectado');
        return;
      }

      const onMessage = (event: MessageEvent) => {
        const msg: FingerprintMessage = JSON.parse(event.data);
        if (msg.workmsg === 9 && typeof msg.retmsg === 'number') {
          ws.removeEventListener('message', onMessage);
          resolve(msg.retmsg);
        }
      };

      ws.addEventListener('message', onMessage);
      sendCommand({ cmd: 'match', data1, data2 });
    });
  };

  return { state, captureFingerprint, matchFingerprint };
};

export default useFingerprint;
