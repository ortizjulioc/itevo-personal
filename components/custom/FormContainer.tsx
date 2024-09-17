import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface FormContainerProps {
    children: ReactNode;
    labelWidth?: string | number;
    layout?: 'horizontal' | 'vertical' | 'inline';
    size?: 'lg' | 'sm' | 'md';
    className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
    children,
    labelWidth = 100,
    layout = 'vertical',
    size = 'md',
    className
}) => {
    // Simulación del contexto
    const context = {
        labelWidth,
        layout,
        size
    };

    return (
        <div className={classNames('form-container', layout, className)}>
            {children}
        </div>
    );
};

export default FormContainer;
