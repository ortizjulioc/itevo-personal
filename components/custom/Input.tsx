// Input.tsx
import React, { useState, useEffect, useRef, ForwardedRef } from 'react';
import { FieldProps } from 'formik';

interface InputProps {
    asElement?: 'input' | 'textarea'; // Element type, e.g., 'input' or 'textarea'
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    prefix?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    suffix?: React.ReactNode;
    textArea?: boolean;
    type?: string;
    style?: React.CSSProperties;
    unstyle?: boolean;
    field?: React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    form?: FieldProps<any>['form']; // Reemplaza con el tipo apropiado para el contexto del formulario
    errorMessage?: string; // Añadido para mostrar mensajes de error
    placeholder?: string; // Añadido para manejar el placeholder
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>((props, ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
        asElement = 'input',
        className,
        disabled,
        invalid,
        prefix,
        size = 'medium',
        suffix,
        type = 'text',
        style,
        unstyle,
        field,
        form,
        errorMessage,
        placeholder,
        ...rest
    } = props;

    const [prefixGutter, setPrefixGutter] = useState(0);
    const [suffixGutter, setSuffixGutter] = useState(0);

    const prefixNode = useRef<HTMLDivElement>(null);
    const suffixNode = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getAffixSize = () => {
            if (prefixNode.current) {
                setPrefixGutter(prefixNode.current.offsetWidth);
            }
            if (suffixNode.current) {
                setSuffixGutter(suffixNode.current.offsetWidth);
            }
        };
        getAffixSize();
    }, [prefix, suffix]);

    const affixGutterStyle: React.CSSProperties = {
        paddingLeft: prefix ? `${prefixGutter}px` : undefined,
        paddingRight: suffix ? `${suffixGutter}px` : undefined,
    };

    const inputProps = {
        className: !unstyle ? `input ${size} ${invalid ? 'input-invalid' : ''} ${className || ''}` : '',
        disabled,
        type,
        placeholder,
        ref,
        ...field,
        ...rest
    };

    const renderInput = asElement === 'textarea' ? (
        <textarea style={{ ...affixGutterStyle, ...style }} {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
    ) : (
        <input style={{ ...affixGutterStyle, ...style }} {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)} />
    );

    return (
        <div className={`input-wrapper ${prefix || suffix ? className : ''}`}>
            {prefix && <div className="input-prefix" ref={prefixNode}>{prefix}</div>}
            {renderInput}
            {suffix && <div className="input-suffix" ref={suffixNode}>{suffix}</div>}
            {invalid && errorMessage && <div className="input-error">{errorMessage}</div>}
        </div>
    );
});

export default Input;
