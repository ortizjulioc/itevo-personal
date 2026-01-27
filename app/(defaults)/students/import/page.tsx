'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui';
import { IconFolderPlus, IconFile, IconTxtFile, IconDownload } from '@/components/icon';
import { openNotification } from '@/utils/open-notification';
import { useRouter } from 'next/navigation';
import { ViewTitle } from '@/components/common';
import Link from 'next/link';

export default function StudentImport() {
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
        // Reset previous results when new file is loaded
        setResult(null);
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
      .filter(part => part.length >= 8); // Basic validation, phone numbers usually have 10 digits

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
        openNotification('success', `Importación completada. ${res.created.length} creados, ${res.errors.length} errores.`);
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

  return (
    <div>
      <ViewTitle
        title="Importar Estudiantes"
        className="mb-6"
        showBackPage
      />

      <div className="panel">
        {!result ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500">
                Sube un archivo Excel o JSON para importar estudiantes masivamente.
                Puedes descargar la plantilla para ver el formato requerido.
              </p>
              <Button size="sm" onClick={downloadTemplate} icon={<IconDownload />}>
                Descargar Plantilla
              </Button>
            </div>

            <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900 text-sm">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Instrucciones del Archivo</h4>
              <ul className="list-disc pl-5 space-y-1 text-blue-700 dark:text-blue-400">
                <li>Formatos soportados: <strong>.xlsx, .xls, .csv, .json</strong></li>
                <li>
                  Columnas requeridas:
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Nombres</span>,
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Apellidos</span>
                </li>
                <li>
                  Columnas opcionales:
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Cedula</span>,
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Telefono</span>,
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Email</span>,
                  <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded ml-1">Direccion</span>
                </li>
                <li className="italic text-xs mt-2">Los encabezados no distinguen mayúsculas/minúsculas (ej. "Nombre", "nombre", "NOMBRE" son válidos).</li>
              </ul>
            </div>

            <div className="flex items-center justify-center w-full mb-6">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <IconFolderPlus className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastrar y soltar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, CSV o JSON</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".xlsx,.xls,.csv,.json" onChange={handleFileChange} />
              </label>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                {file.name.endsWith('.json') ? <IconTxtFile /> : <IconFile />}
                <span className="font-medium">{file.name}</span>
                <span className="text-gray-500">({data.length} registros detectados)</span>
                <button onClick={reset} className="ml-auto text-red-500 hover:text-red-700 text-xs underline">Eliminar</button>
              </div>
            )}

            {data.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Vista previa (Primeros 5 registros)</h3>
                <div className="overflow-auto border rounded text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-3">Nombre</th>
                        <th className="p-3">Apellido</th>
                        <th className="p-3">Cédula</th>
                        <th className="p-3">Teléfono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">{row.nombres || '-'}</td>
                          <td className="p-3">{row.apellidos || '-'}</td>
                          <td className="p-3">{normalizeIdentification(row.cedula) || <span className="text-gray-400 italic">Vacío/Inválido</span>}</td>
                          <td className="p-3">{normalizePhone(row.telefono) || <span className="text-gray-400 italic">Vacío/Inválido</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.length > 5 && (
                  <p className="text-center text-xs text-gray-500 mt-2">... y {data.length - 5} más</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/students">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button onClick={handleUpload} disabled={!file || loading || data.length === 0}>
                {loading ? 'Importando...' : 'Iniciar Importación'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h5 className="font-bold text-lg mb-1">
                Importación Finalizada
              </h5>
              <p>Se han creado <b>{result.created.length}</b> estudiantes exitosamente.</p>
            </div>

            {result.errors.length > 0 ? (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-lg p-4 mb-6">
                <h5 className="font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  Errores encontrados ({result.errors.length})
                </h5>
                <div className="overflow-auto max-h-[300px]">
                  <ul className="list-disc pl-5 text-sm space-y-1 text-red-700 dark:text-red-300">
                    {result.errors.map((err: any, i: number) => (
                      <li key={i}>
                        <span className="font-semibold text-red-800 dark:text-red-200">Fila {Number(err.index) + 1}:</span> {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-3 italic">
                  Por favor, corrige estos registros en tu archivo y vuelve a intentarlo si es necesario.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded text-center text-blue-800 dark:text-blue-300 mb-6">
                <p>Todos los registros fueron procesados correctamente.</p>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={reset}>Importar otro archivo</Button>
              <Button onClick={() => router.push('/students')}>Ir a lista de Estudiantes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
