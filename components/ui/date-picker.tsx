'use client';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FieldProps } from 'formik';

interface DatePickerProps {
  mode?: 'single' | 'datetime' | 'range' | 'time';
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps & Partial<FieldProps>> = ({ mode = 'single', value, onChange, field, form, ...rest }) => {
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

  const getOptions = () => {
    if (mode === 'datetime') {
      return { enableTime: true, dateFormat: 'Y-m-d H:i' }; // Sin 'mode'
    }
    return {
      mode: mode as 'single' | 'range' | 'time' | 'multiple', // Forzamos el tipo correcto
      enableTime: mode === 'time',
      noCalendar: mode === 'time',
      dateFormat: mode === 'time' ? 'H:i' : 'Y-m-d',
    };
  };

  return (
    <Flatpickr
      value={value || ''}
      options={getOptions()}
      className="form-input"
      onChange={handleChange}
      {...rest}
    />
  );
};

export default DatePicker;
