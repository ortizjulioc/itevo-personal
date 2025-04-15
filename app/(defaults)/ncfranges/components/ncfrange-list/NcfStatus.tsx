import React from 'react';
import { TbPointFilled } from 'react-icons/tb';

interface NcfStatusProps {
  isActive: boolean;
}

export default function NcfStatus({ isActive }: NcfStatusProps) {
  return (
    <span
      className={`flex items-center gap-1 font-bold min-w-max italic ${
        isActive
          ? ' text-green-600'
          : ' text-red-600'
      }`}
    >
      <TbPointFilled />
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}
