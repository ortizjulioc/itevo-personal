'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Drawer from '@/components/ui/drawer';
import { Button } from '@/components/ui';
import { IconFolderPlus, IconFile, IconTxtFile, IconDownload } from '@/components/icon';
import { openNotification } from '@/utils/open-notification';
import { useRouter } from 'next/navigation';

interface StudentBatchImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function StudentBatchImport({ open, onOpenChange, onSuccess }: StudentBatchImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: any[]; errors: any[] } | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target?.result;
      let jsonData: any[] = [];

      try {
        if (file.name.endsWith('.json')) {
          jsonData = JSON.parse(bstr as string);
        } else {
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          jsonData = XLSX.utils.sheet_to_json(ws);
        }

        // Basic mapping normalization (column headers to lowercase keys)
        const mappedData = jsonData.map((row: any) => {
          const newRow: any = {};
          Object.keys(row).forEach((key) => {
            const lowerKey = key.toLowerCase().trim();
            // Map common headers to API expected keys
            if (lowerKey.includes('nombre')) newRow.nombres = row[key];
            else if (lowerKey.includes('apellido')) newRow.apellidos = row[key];
            else if (lowerKey.includes('cedula') || lowerKey.includes('identificacion')) newRow.cedula = row[key];
            else if (lowerKey.includes('telefono') || lowerKey.includes('celular')) newRow.telefono = row[key];
            else if (lowerKey.includes('email') || lowerKey.includes('correo')) newRow.email = row[key];
            else if (lowerKey.includes('direccion')) newRow.direccion = row[key];
            else newRow[lowerKey] = row[key];
          });
          if (!newRow.nombres && row.nombres) newRow.nombres = row.nombres;
          if (!newRow.apellidos && row.apellidos) newRow.apellidos = row.apellidos;
          if (!newRow.cedula && row.cedula) newRow.cedula = row.cedula;
          return newRow;
        });

        setData(mappedData);
      } catch (error) {
        console.error("Error parsing file:", error);
        openNotification('error', "No se pudo procesar el archivo. Verifique el formato.");
      }
    };

    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const normalizePhone = (phone: string | number | null | undefined): string | null => {
    if (!phone) return null;
    const str = String(phone);
    const parts = str.split(/[,/\\]/);
    const normalizedParts = parts
      .map(part => part.replace(/\D/g, ''))
      .filter(part => part.length > 0);

    if (normalizedParts.length === 0) return null;
    return normalizedParts.join(',');
  };

  const normalizeIdentification = (id: string | number | null | undefined): string | null => {
    if (!id) return null;
    const str = String(id).toUpperCase();
    if (str.includes('MENOR') || str.includes('SIN CEDULA') || str.trim() === '') {
      return null;
    }
    const digits = str.replace(/\D/g, '');
    return digits.length > 0 ? digits : null;
  };

  const downloadTemplate = () => {
    const headers = [
      ["Nombres", "Apellidos", "Cedula", "Telefono", "Email", "Direccion"]
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    XLSX.writeFile(wb, "plantilla_estudiantes.xlsx");
  };

  const handleUpload = async () => {
    if (data.length === 0) return;

    setLoading(true);

    const normalizedData = data.map(student => ({
      ...student,
      telefono: normalizePhone(student.telefono),
      cedula: normalizeIdentification(student.cedula),
    }));

    try {
      const response = await fetch('/api/students/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedData),
      });

      const res = await response.json();

      if (response.ok) {
        setResult({ created: res.created, errors: res.errors });
        if (onSuccess) onSuccess();
      } else {
        openNotification('error', res.error || "Ocurrió un error al importar.");
      }
    } catch (error) {
      openNotification('error', "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setData([]);
    setResult(null);
  }

  const handleClose = () => {
    reset();
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onClose={handleClose} title="Importar Estudiantes" className="w-[600px] max-w-full">
      <div className="p-4 h-full flex flex-col">
        {!result ? (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={downloadTemplate} icon={<IconDownload />}>
                Descargar Plantilla
              </Button>
            </div>

            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <IconFolderPlus className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastrar y soltar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, CSV o JSON</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".xlsx,.xls,.csv,.json" onChange={handleFileChange} />
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm mt-4">
                {file.name.endsWith('.json') ? <IconTxtFile /> : <IconFile />}
                <span>{file.name}</span>
                <span className="text-gray-400">({data.length} registros detectados)</span>
              </div>
            )}

            {data.length > 0 && (
              <div className="flex-1 overflow-auto border rounded text-xs mt-4">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Apellido</th>
                      <th className="p-2 text-left">Cédula</th>
                      <th className="p-2 text-left">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{row.nombres || '-'}</td>
                        <td className="p-2">{row.apellidos || '-'}</td>
                        <td className="p-2">{normalizeIdentification(row.cedula) || <span className="text-gray-400 italic">Vacío</span>}</td>
                        <td className="p-2">{normalizePhone(row.telefono) || <span className="text-gray-400 italic">Vacío</span>}</td>
                      </tr>
                    ))}
                    {data.length > 5 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-center text-gray-500">
                          ... y {data.length - 5} más
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button onClick={handleUpload} disabled={!file || loading || data.length === 0}>
                {loading ? 'Importando...' : 'Importar'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded mb-4">
              <h5 className="font-bold flex items-center gap-2">
                Importación Finalizada
              </h5>
              <p>Se crearon <b>{result.created.length}</b> estudiantes exitosamente.</p>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded mb-4 flex-1 overflow-hidden flex flex-col">
                <h5 className="font-bold mb-2">Errores ({result.errors.length})</h5>
                <p className="text-sm mb-2">Los siguientes registros no pudieron ser creados:</p>
                <ul className="flex-1 overflow-auto list-disc pl-5 text-sm space-y-1">
                  {result.errors.map((err: any, i: number) => (
                    <li key={i}>
                      <span className="font-semibold">Fila {err.index + 1}:</span> {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-auto">
              <Button variant="outline" onClick={reset}>Importar más</Button>
              <Button onClick={handleClose}>Cerrar</Button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
