'use client';

import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FieldProps } from 'formik';

interface DatePickerProps {
  mode?: 'single' | 'datetime' | 'range' | 'time';
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
  placeholder?: string;
  isClearable?: boolean;
}

const DatePicker: React.FC<DatePickerProps & Partial<FieldProps>> = ({
  mode = 'single',
  value,
  onChange,
  field,
  form,
  isClearable = false,
  ...rest
}) => {
  const handleChange = (dates: Date[] | Date) => {
    let formattedDate: Date | Date[];

    if (Array.isArray(dates)) {
      formattedDate = mode === 'range' ? dates : dates[0];
    } else {
      formattedDate = dates;
    }

    if (onChange) onChange(formattedDate);
    if (form && field) {
      form.setFieldValue(field.name, formattedDate);
    }
  };

  const handleClear = () => {
    const clearedValue = '' as unknown as Date;
  
    if (onChange) onChange(clearedValue);
    if (form && field) {
      form.setFieldValue(field.name, clearedValue);
    }
  };
  

  const getOptions = () => {
    if (mode === 'datetime') {
      return { enableTime: true, dateFormat: 'Y-m-d H:i' };
    }
    return {
      mode: mode as 'single' | 'range' | 'time' | 'multiple',
      enableTime: mode === 'time',
      noCalendar: mode === 'time',
      dateFormat: mode === 'time' ? 'H:i' : 'Y-m-d',
    };
  };

  const hasValue = Array.isArray(value) ? value.length > 0 : !!value;

  return (
    <div className="relative w-full">
      <Flatpickr
        value={value || ''}
        options={getOptions()}
        className="form-input pr-10 w-full"
        onChange={handleChange}
        {...rest}
      />
      {(isClearable && hasValue) && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DatePicker;
