import { NextRequest, NextResponse } from 'next/server';
import { changeLogo } from '@/services/settings-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo.' }, { status: 400 });
    }

    // Aquí podrías guardar la URL en la base de datos si es necesario
    await changeLogo(file);
    return NextResponse.json({ message: 'Archivo subido con éxito.', });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    return NextResponse.json({ error: 'Error al procesar la subida.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await changeLogo(''); // Asumiendo que pasar una cadena vacía elimina el logo

    return NextResponse.json({ message: 'Logo eliminado con éxito.' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el logo:', error);
    return NextResponse.json({ error: 'Error al procesar la eliminación.' }, { status: 500 });
  }
}
