'use client';
import React, { useRef } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface TooltipProps {
  children: React.ReactElement;
  title: string;
  trigger?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  trigger = 'mouseenter focus',
  placement = 'top',
}) => {
  // Use reference prop instead of children to avoid React 19 element.ref incompatibility.
  // Tippy used to clone the child and attach a ref via element.ref (removed in React 19).
  // Now we point Tippy to a wrapper span via a ref callback.
  const anchorRef = useRef<any>(null);

  return (
    <>
      <Tippy
        content={title}
        trigger={trigger}
        placement={placement}
        reference={anchorRef}
      />
      <span
        ref={(el) => { anchorRef.current = el; }}
        style={{ display: 'inline-flex' }}
      >
        {children}
      </span>
    </>
  );
};

export default Tooltip;
