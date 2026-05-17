import React, { useMemo } from 'react';
import { formatCompactNumber, formatFullNumber } from '@/utils/formatters';
import PremiumTooltip from '@/components/ui/premium-tooltip';

export interface CompactNumberProps {
  /** El número a formatear */
  value: number;
  /** Clases CSS opcionales */
  className?: string;
  /** Determina si se muestra el tooltip nativo al hacer hover. Por defecto es true. */
  showTooltip?: boolean;
}

export const CompactNumber: React.FC<CompactNumberProps> = ({
  value,
  className = '',
  showTooltip = true
}) => {
  const compactValue = useMemo(() => formatCompactNumber(value), [value]);
  const fullValue = useMemo(() => formatFullNumber(value), [value]);

  if (!showTooltip) {
    return <span className={className}>{compactValue}</span>;
  }

  return (
    <PremiumTooltip content={fullValue}>
      <span
        className={className}
        aria-label={fullValue}
        style={{ cursor: 'default' }}
      >
        {compactValue}
      </span>
    </PremiumTooltip>
  );
};

export default CompactNumber;
