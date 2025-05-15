import classNames from 'classnames';
import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'rounded' | 'outline';
    color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark'| 'outline';
    children?: React.ReactNode;
    icon?: React.ReactElement;
    loading?: boolean;
}

const MAP_COLOR = {
    primary: 'btn-primary',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    secondary: 'btn-secondary',
    dark: 'btn-dark',
    outline: 'btn-outline-primary',
};

const MAP_OUTLINE_COLOR = {
    primary: 'btn-outline-primary',
    info: 'btn-outline-info',
    success: 'btn-outline-success',
    warning: 'btn-outline-warning',
    danger: 'btn-outline-danger',
    secondary: 'btn-outline-secondary',
    dark: 'btn-outline-dark',
    outline: 'btn-outline-primary',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    size = 'md',
    variant = 'default',
    color = 'primary',
    children,
    icon,
    loading = false,
    ...rest
}, ref) => {
    const getSizeClass = () => {
        switch (size) {
            case 'sm':
                return 'btn-sm';
            case 'md':
                return '';
            case 'lg':
                return 'btn-lg';
            default:
                return '';
        }
    };

    const getVariantClass = () => {
        switch (variant) {
            case 'rounded':
                return 'rounded-full';
            case 'outline':
                return MAP_OUTLINE_COLOR[color];
            default:
                return color ? MAP_COLOR[color] : 'btn-primary';
        }
    };

    const btnClasses = classNames(
        'btn',
        getVariantClass(),
        getSizeClass(),
        { 'disabled:opacity-50 disabled:cursor-not-allowed': (disabled || loading) },
        { 'p-2': icon || !children },
        className
    );

    return (
        <button
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={(disabled || loading)}
            className={btnClasses}
            {...rest}
        >
            {loading && (<span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>)}
            {(icon && !loading) && <span className={`${children && 'mr-2'}`}>{icon}</span>}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
