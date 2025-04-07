import React from 'react';

interface NcfStatusProps {
  isActive: boolean;
}

export default function NcfStatus({ isActive }: NcfStatusProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}
