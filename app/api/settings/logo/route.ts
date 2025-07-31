import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { changeLogo } from '@/services/settings-service';
import { normalizeString } from '@/utils/normalize-string';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido.' }, { status: 400 });
    }

    // Convertir el archivo a un buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir la ruta donde se guardará la imagen
    const uploadDir = join(process.cwd(), 'public/uploads/logo');
    // Asegurarse de que el directorio exista
    await mkdir(uploadDir, { recursive: true });

    const originalName = file.name;
    const extension = originalName.split('.').pop(); // última parte
    const baseName = originalName.replace(/\.[^/.]+$/, ''); // quita solo la última extensión

    const fileName = `${Date.now()}-${normalizeString(baseName, { replacement: '-' })}.${extension}`;
    const filePath = join(uploadDir, fileName);

    // Guardar el archivo en el servidor
    await writeFile(filePath, buffer);

    // Devolver la URL pública del archivo
    const fileUrl = `/uploads/logo/${fileName}`;

    // Aquí podrías guardar la URL en la base de datos si es necesario
    await changeLogo(fileUrl);

    await createLog({
      action: 'POST',
      description: `Logo cambiado a ${fileName}`,
      origin: 'settings/logo',
      success: true,
      elementId: fileName,
    });
    return NextResponse.json({ message: 'Archivo subido con éxito.', url: fileUrl });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    await createLog({
      action: 'POST',
      description: `Error al cambiar el logo: ${formatErrorMessage(error)}`,
      origin: 'settings/logo',
      success: false,
      elementId: '',
    });
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Obtener el nombre del archivo desde el cuerpo de la solicitud
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'No se proporcionó el nombre del archivo.' }, { status: 400 });
    }

    // Construir la ruta del archivo
    const filePath = join(process.cwd(), 'public/uploads/logo', fileName);

    // Verificar si el archivo existe y eliminarlo
    try {
        await unlink(filePath);
    } catch (error) {
        await createLog({
            action: 'DELETE',
            description: `Error al eliminar el archivo (${fileName}). Detalles del error: ${formatErrorMessage(error)}`,
            origin: 'settings/logo',
            success: false,
            elementId: fileName,
        });
    }

    await changeLogo(''); // Asumiendo que pasar una cadena vacía elimina el logo
    await createLog({
      action: 'DELETE',
      description: `Logo eliminado: ${fileName}`,
      origin: 'settings/logo',
      success: true,
      elementId: fileName,
    });
    return NextResponse.json({ message: 'Logo eliminado con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el logo:', error);
    await createLog({
      action: 'DELETE',
      description: `Error al eliminar el logo: ${formatErrorMessage(error)}`,
      origin: 'settings/logo',
      success: false,
    });
    return NextResponse.json({ message: formatErrorMessage(error) }, { status: 500 });
  }
}
