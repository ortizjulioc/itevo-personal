import 'server-only';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { NextRequest } from 'next/server';

export interface SessionWithBranch {
  user: {
    id: string;
    username: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    mainBranch: any;
    activeBranchId: string;
    branches: any[];
    roles: any[];
  };
}

/**
 * Obtiene la sesión del servidor con información de la sucursal activa
 * @param request - Request opcional de Next.js
 * @returns Sesión con información de sucursal activa o null
 */
export async function getServerSessionWithBranch(request?: NextRequest): Promise<SessionWithBranch | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  return session as SessionWithBranch;
}

/**
 * Obtiene el ID de la sucursal activa del usuario
 * @param request - Request opcional de Next.js
 * @returns ID de la sucursal activa o null
 */
export async function getActiveBranchId(request?: NextRequest): Promise<string | null> {
  const session = await getServerSessionWithBranch(request);
  return (session?.user as any)?.activeBranchId || null;
}

/**
 * Verifica si el usuario tiene un rol específico en la sucursal activa
 * @param roleName - Nombre normalizado del rol
 * @param request - Request opcional de Next.js
 * @returns true si el usuario tiene el rol, false en caso contrario
 */
export async function hasRole(roleName: string, request?: NextRequest): Promise<boolean> {
  const session = await getServerSessionWithBranch(request);
  if (!session) return false;

  const roles = session.user.roles || [];
  return roles.some((role: any) => role.normalizedName === roleName);
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 * @param roleNames - Array de nombres normalizados de roles
 * @param request - Request opcional de Next.js
 * @returns true si el usuario tiene al menos uno de los roles, false en caso contrario
 */
export async function hasAnyRole(roleNames: string[], request?: NextRequest): Promise<boolean> {
  const session = await getServerSessionWithBranch(request);
  if (!session) return false;

  const roles = session.user.roles || [];
  const userRoleNames = roles.map((role: any) => role.normalizedName);
  return roleNames.some(roleName => userRoleNames.includes(roleName));
}

