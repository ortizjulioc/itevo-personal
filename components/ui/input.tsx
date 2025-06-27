import React, { forwardRef } from 'react';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field?: any;
  icon?: React.ElementType;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ field, className = '', icon: Icon, ...rest }, ref) => {
    const inputClasses = classNames(
      'form-input py-2 pr-11 peer disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]',
      { 'cursor-not-allowed text-gray-600 dark:text-gray-500': rest.disabled },
      className
    );

    if (Icon) {
      return (
        <div className="relative">
          <input
            ref={ref}
            {...field}
            className={`${inputClasses} placeholder:tracking-widest pl-9 pr-9 sm:pr-4`}
            {...rest}
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

    return (
      <input
        ref={ref}
        className={inputClasses}
        {...field}
        {...rest}
      />
    );
  }
);

// 👇 Esto es necesario para evitar advertencias en React DevTools
Input.displayName = 'Input';

export default Input;
