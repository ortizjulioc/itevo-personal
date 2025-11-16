import React, { forwardRef } from 'react';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: any;
  icon?: React.ElementType;
  className?: string;
  textArea?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ field, className = '', icon: Icon, textArea, ...rest }, ref) => {
    const inputClasses = classNames(
      'form-input py-2 pr-11 peer disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]',
      { 'cursor-not-allowed text-gray-600 dark:text-gray-500': rest.disabled },
      className
    );

    // Para inputs de tipo number, convertir 0 a string vacío
    const getValue = () => {
      const value = field?.value !== undefined ? field.value : rest.value;
      if (rest.type === 'number' && (value === 0 || value === '0')) {
        return '';
      }
      return value;
    };

    const inputValue = getValue();
    const { value: _, ...restWithoutValue } = rest;

    if (Icon) {
      return (
        <div className="relative">
          <input
            ref={ref}
            {...field}
            value={inputValue}
            className={`${inputClasses} placeholder:tracking-widest pl-9 pr-9 sm:pr-4`}
            {...restWithoutValue}
          />
          <button
            type="button"
            className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto"
          >
            <Icon className="mx-auto" />
          </button>
        </div>
      );
    }

    if (textArea) {
      return (
        <textarea
          ref={ref}
          className={inputClasses}
          {...field}
          {...rest}
        />
      );
    }

    return (
      <input
        ref={ref}
        className={inputClasses}
        {...field}
        value={inputValue}
        {...restWithoutValue}
      />
    );
  }
);

// 👇 Esto es necesario para evitar advertencias en React DevTools
Input.displayName = 'Input';

export default Input;
