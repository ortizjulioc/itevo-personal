import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/auth-options';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { branchId } = body;

    if (!branchId) {
      return NextResponse.json(
        { error: 'El branchId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario tenga acceso a esta sucursal
    const userBranches = (session.user as any).branches || [];
    const targetBranch = userBranches.find((b: any) => b.id === branchId);

    if (!targetBranch) {
      return NextResponse.json(
        { error: 'No tienes acceso a esta sucursal' },
        { status: 403 }
      );
    }

    // Retornar la sucursal y roles actualizados
    // El frontend debe usar update() de useSession para actualizar la sesión
    return NextResponse.json({
      success: true,
      branch: targetBranch,
      roles: targetBranch.roles || [],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: formatErrorMessage(error) },
      { status: 500 }
    );
  }
}

