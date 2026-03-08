import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params;
    const pathArray = params?.path || [];
    
    if (!pathArray || pathArray.length === 0) {
      return NextResponse.json({ error: 'Ruta no válida' }, { status: 400 });
    }

    // Sanitize path (avoid directory traversal)
    const sanitizedPath = pathArray.filter(p => p && !p.includes('..'));
    
    // Base dir where uploads are saved
    const baseDir = join(process.cwd(), 'uploads');
    const filePath = join(baseDir, ...sanitizedPath);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    if (ext === 'jpeg' || ext === 'jpg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'svg') contentType = 'image/svg+xml';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'pdf') contentType = 'application/pdf';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
