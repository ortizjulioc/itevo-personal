'use client';

import { Branch, Role } from '@prisma/client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Dropdown from '@/components/dropdown';
import { IconCaretDown } from '@/components/icon';
import { openNotification } from '@/utils';

type BranchWithRoles = Branch & {
  roles: Role[];
};

type BranchSwitcherProps = {
  branches: BranchWithRoles[];
};

export default function BranchSwitcher({ branches }: BranchSwitcherProps) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  if (!branches || branches.length === 0) {
    return <span className="text-sm text-gray-500">No hay sucursales disponibles</span>;
  }

  const currentBranch = (session?.user as any)?.mainBranch;
  const activeBranchId = (session?.user as any)?.activeBranchId || currentBranch?.id;

  // Si solo hay una sucursal, solo mostrar el nombre
  if (branches.length === 1) {
    return (
      <span className="badge bg-primary text-white px-3 py-1.5 text-sm font-medium">
        {branches[0]?.name}
      </span>
    );
  }

  const handleBranchChange = async (branchId: string) => {
    if (branchId === activeBranchId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/change-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branchId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al cambiar de sucursal');
      }

      const data = await response.json();

      // Actualizar la sesión con la nueva sucursal activa
      await update({
        activeBranchId: branchId,
      });

      openNotification('success', `Sucursal cambiada a: ${data.branch.name}`);
      
      // Recargar la página para actualizar los permisos y datos
      window.location.reload();
    } catch (error: any) {
      openNotification('error', error.message || 'Error al cambiar de sucursal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dropdown
      offset={[0, 8]}
      placement="bottom-end"
      btnClassName="relative group block"
      button={
        <button
          type="button"
          className="badge bg-primary text-white px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          <span>{currentBranch?.name || branches[0]?.name}</span>
          <IconCaretDown className="w-3 h-3" />
        </button>
      }
    >
      <ul className="w-[250px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
        <li className="px-4 py-2 border-b border-white-light dark:border-white-light/10">
          <span className="text-xs text-gray-500 dark:text-gray-400">Sucursales disponibles</span>
        </li>
        {branches.map((branch) => {
          const isActive = branch.id === activeBranchId;
          return (
            <li key={branch.id}>
              <button
                type="button"
                onClick={() => handleBranchChange(branch.id)}
                disabled={loading || isActive}
                className={`w-full text-left px-4 py-2.5 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors ${
                  isActive
                    ? 'bg-primary/20 dark:bg-primary/30 font-semibold'
                    : ''
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{branch.name}</span>
                  {isActive && (
                    <span className="text-xs text-primary">✓ Activa</span>
                  )}
                </div>
                {branch.roles && branch.roles.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {branch.roles.map((r) => r.name).join(', ')}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Dropdown>
  );
}
