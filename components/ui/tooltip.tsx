import React, { ReactNode } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface TooltipProps {
  children: React.ReactElement; // El contenido dentro del Tippy
  title: string; // Texto que se mostrará en el popover
  trigger?: string; // Trigger opcional (por defecto "mouseenter focus")
  placement?: 'top' | 'bottom' | 'left' | 'right'; // Placement opcional (por defecto "top" que ya es el default en Tippy)
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  trigger = 'mouseenter focus', // Valor por defecto
  placement = 'top', // Valor opcional, pero ya está predefinido en Tippy
}) => {
  return (
    <Tippy content={title} trigger={trigger} placement={placement}>
      {children}
    </Tippy>
  );
};

export default Tooltip;
