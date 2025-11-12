'use client';

import { useSession } from 'next-auth/react';

/**
 * Hook para obtener la sucursal activa del usuario desde la sesión
 * @returns La sucursal activa o null si no hay sesión
 */
export function useActiveBranch() {
  const { data: session } = useSession();
  
  const user = session?.user as {
    activeBranchId?: string;
    mainBranch?: any;
    branches?: any[];
  } | undefined;

  const activeBranchId = user?.activeBranchId || user?.mainBranch?.id || user?.branches?.[0]?.id || null;
  const activeBranch = user?.mainBranch || user?.branches?.find(b => b.id === activeBranchId) || user?.branches?.[0] || null;

  return {
    activeBranchId,
    activeBranch,
    branches: user?.branches || [],
  };
}

