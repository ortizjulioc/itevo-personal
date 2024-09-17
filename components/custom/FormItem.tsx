import React, { useState, useEffect, useRef, ForwardedRef } from 'react';
import classNames from 'classnames';

interface FormItemProps {
    children: React.ReactNode;
    label?: string;
    labelClass?: string;
    errorMessage?: string;
    invalid?: boolean;
    className?: string;
    layout?: 'horizontal' | 'vertical' | 'inline';
    labelWidth?: string | number;
    asterisk?: boolean;
    extra?: React.ReactNode;
    htmlFor?: string;
    style?: React.CSSProperties;
    size?: 'lg' | 'sm' | 'md';
}

const CONTROL_SIZES: Record<string, string> = {
    lg: 'h-12',
    sm: 'h-8',
    md: 'h-10',
};

const LAYOUT = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
    INLINE: 'inline',
};

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
    const {
        children,
        label,
        labelClass,
        errorMessage,
        invalid,
        className,
        layout,
        labelWidth,
        asterisk,
        style,
        size,
        extra,
        htmlFor
    } = props;

    const formContext = { size: 'md', labelWidth: 'auto', layout: LAYOUT.HORIZONTAL };
    const controlSize = 'md';

    const formItemLabelHeight = size || formContext.size || controlSize;
    const formItemLabelWidth = labelWidth || formContext.labelWidth;
    const formItemLayout = layout || formContext.layout;

    const getFormLabelLayoutClass = () => {
        switch (formItemLayout) {
            case LAYOUT.HORIZONTAL:
                return label ? `h-${CONTROL_SIZES[formItemLabelHeight]} ${label && 'ltr:pr-2 rtl:pl-2'}` : 'ltr:pr-2 rtl:pl-2';
            case LAYOUT.VERTICAL:
                return 'mb-2';
            case LAYOUT.INLINE:
                return `h-${CONTROL_SIZES[formItemLabelHeight]} ${label && 'ltr:pr-2 rtl:pl-2'}`;
            default:
                return '';
        }
    };

    const formItemClass = classNames(
        'form-item',
        formItemLayout,
        className,
        invalid ? 'invalid' : ''
    );

    const formLabelClass = classNames(
        'form-label',
        (label && getFormLabelLayoutClass()),
        labelClass
    );

    const formLabelStyle = () => {
        if (formItemLayout === LAYOUT.HORIZONTAL) {
            return { ...style, minWidth: formItemLabelWidth };
        }
        return style;
    };

    return (
        <div ref={ref} className={formItemClass}>
            <label
                htmlFor={htmlFor}
                className={formLabelClass}
                style={formLabelStyle()}
            >
                {asterisk && <span className="text-red-500 ltr:mr-1 rtl:ml-1">*</span>}
                {label}
                {extra && <span>{extra}</span>}
                {(label && formItemLayout !== 'vertical') && ':'}
            </label>
            <div className={formItemLayout === LAYOUT.HORIZONTAL ? 'w-full flex flex-col justify-center relative' : ''}>
                {children}
                {invalid && errorMessage && (
                    <div className="form-explain text-red-600">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
});

export default FormItem;
