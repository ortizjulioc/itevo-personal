import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { changeLogo } from '@/services/settings-service';

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
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Guardar el archivo en el servidor
    await writeFile(filePath, buffer);

    // Devolver la URL pública del archivo
    const fileUrl = `/uploads/logo/${fileName}`;

    // Aquí podrías guardar la URL en la base de datos si es necesario
    await changeLogo(fileUrl);
    return NextResponse.json({ message: 'Archivo subido con éxito.', url: fileUrl });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json({ error: 'Error al procesar la subida.' }, { status: 500 });
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
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({ error: 'El archivo no existe.' }, { status: 404 });
      }
      throw error; // Lanzar otros errores
    }
    // Por ejemplo, podrías eliminar el archivo del servidor y actualizar la base de datos
    await changeLogo(''); // Asumiendo que pasar una cadena vacía elimina el logo

    return NextResponse.json({ message: 'Logo eliminado con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el logo:', error);
    return NextResponse.json({ error: 'Error al procesar la eliminación.' }, { status: 500 });
  }
}