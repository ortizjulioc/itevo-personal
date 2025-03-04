// components/Badge.tsx
import React, { HTMLAttributes } from 'react';

// Definimos los tipos para las variantes
type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark';

// Props del componente
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: string;
  outline?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  color,
  outline = false,
  children,
  className = '',
  ...props
}) => {
  // Clases base para todos los badges
  const baseClasses = 'relative my-1 rounded px-2 py-0.5 text-xs font-semibold';

  // Función auxiliar para manejar clases de color personalizado
  const getCustomColorClasses = (color: string, isOutline: boolean) => {
    if (isOutline) {
      // Usamos clases completas y seguras para Tailwind
      return `border text-${color} border-${color} hover:bg-opacity-10 hover:bg-${color} dark:hover:bg-${color} dark:hover:text-white-light`;
    }
    // Para sólido
    return `bg-${color} text-white border-transparent hover:bg-opacity-90 dark:hover:bg-opacity-90`;
  };

  // Si se proporciona un color personalizado
  if (color) {
    return (
      <span
        className={`${baseClasses} ${getCustomColorClasses(color, outline)} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }

  // Variantes predefinidas
  const variantClasses: Record<BadgeVariant, { outline: string; solid: string }> = {
    primary: {
      outline: 'border text-primary border-primary hover:bg-primary-light dark:hover:bg-primary dark:hover:text-white-light',
      solid: 'bg-primary text-white border-transparent hover:bg-primary-dark dark:hover:bg-primary-dark',
    },
    secondary: {
      outline: 'border text-secondary border-secondary hover:bg-secondary-light dark:hover:bg-secondary dark:hover:text-white-light',
      solid: 'bg-secondary text-white border-transparent hover:bg-secondary-dark dark:hover:bg-secondary-dark',
    },
    success: {
      outline: 'border text-success border-success hover:bg-success-light dark:hover:bg-success dark:hover:text-white-light',
      solid: 'bg-success text-white border-transparent hover:bg-success-dark dark:hover:bg-success-dark',
    },
    danger: {
      outline: 'border text-danger border-danger hover:bg-danger-light dark:hover:bg-danger dark:hover:text-white-light',
      solid: 'bg-danger text-white border-transparent hover:bg-danger-dark dark:hover:bg-danger-dark',
    },
    warning: {
      outline: 'border text-warning border-warning hover:bg-warning-light dark:hover:bg-warning dark:hover:text-white-light',
      solid: 'bg-warning text-white border-transparent hover:bg-warning-dark dark:hover:bg-warning-dark',
    },
    info: {
      outline: 'border text-info border-info hover:bg-info-light dark:hover:bg-info dark:hover:text-white-light',
      solid: 'bg-info text-white border-transparent hover:bg-info-dark dark:hover:bg-info-dark',
    },
    dark: {
      outline: 'border text-dark border-dark hover:bg-dark-light dark:hover:bg-dark dark:hover:text-white-light',
      solid: 'bg-dark text-white border-transparent hover:bg-dark-dark dark:hover:bg-dark-dark',
    },
  };

  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  return (
    <span
      className={`${baseClasses} ${outline ? selectedVariant.outline : selectedVariant.solid} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;