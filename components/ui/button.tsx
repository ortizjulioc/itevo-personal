import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'rounded' | 'outline';
    color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark';
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    type = 'button',
    disabled = false,
    className,
    size = 'md',
    variant = 'default',
    color = 'primary',
    children,
    icon,
    ...rest
}) => {
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
                return `btn-outline-${color}`;
            default:
                return 'btn-primary';
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${getSizeClass()} ${getVariantClass()} ${className}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
