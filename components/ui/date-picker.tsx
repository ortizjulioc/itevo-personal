'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { FieldProps } from 'formik';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker-custom.css'; // Custom styles for react-datepicker

type Mode = 'single' | 'range' | 'time' | 'datetime';

export interface DatePickerProps {
  mode?: Mode;
  value?: Date | [Date | null, Date | null] | null;
  onChange?: (value: Date | [Date | null, Date | null] | null) => void;
  placeholder?: string;
  isClearable?: boolean;
  className?: string;
}

export const extractDate = (
  input: Date | [Date | null, Date | null] | null
): string => {
  if (input instanceof Date) return input.toISOString();
  if (Array.isArray(input) && input[0] instanceof Date) return input[0].toISOString();
  return '';
};

const DatePicker: React.FC<DatePickerProps & Partial<FieldProps>> = ({
  mode = 'single',
  value,
  onChange,
  placeholder,
  isClearable = false,
  className = '',
  field,
  form,
  ...rest
}) => {
  const isRange = mode === 'range';

  const handleChange = (
    date: Date | [Date | null, Date | null] | null
  ) => {
    if (onChange) onChange(date);
    if (form && field) form.setFieldValue(field.name, date);
  };

  return (
    // <div className="relative w-full">
      <ReactDatePicker
        {...(isRange
          ? {
              selectsRange: true,
              startDate: (value as [Date | null, Date | null])?.[0],
              endDate: (value as [Date | null, Date | null])?.[1],
              selected: (value as [Date | null, Date | null])?.[0],
            }
          : {
          selected: value as Date | null,
        })}
        selected={!isRange ? (value as Date | null) : (value as [Date | null, Date | null])[0]}
        startDate={isRange ? (value as [Date | null, Date | null])?.[0] : undefined}
        endDate={isRange ? (value as [Date | null, Date | null])?.[1] : undefined}
        onChange={handleChange}
        showTimeSelect={mode === 'time' || mode === 'datetime'}
        showTimeSelectOnly={mode === 'time'}
        dateFormat={
          mode === 'datetime' ? 'yyyy-MM-dd HH:mm' :
          mode === 'time' ? 'HH:mm' :
          'yyyy-MM-dd'
        }
        placeholderText={placeholder}
        isClearable={isClearable}
        className={`form-input w-full ${className}`}
        {...rest}
      />
    // </div>
  );
};

DatePicker.displayName = 'DatePicker';export default DatePicker;
