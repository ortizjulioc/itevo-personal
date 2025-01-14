'use client';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FieldProps } from 'formik';

interface DatePickerProps {
  mode?: 'single' | 'datetime' | 'range' | 'time';
  value?: Date | Date[];
  onChange?: (date: Date | Date[]) => void;
}

const DatePicker: React.FC<DatePickerProps & Partial<FieldProps>> = ({ mode = 'single', value, onChange, field, form }) => {
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
    switch (mode) {
      case 'datetime':
        return { enableTime: true, dateFormat: 'Y-m-d H:i' };
      case 'range':
        return { mode: 'range', dateFormat: 'Y-m-d' };
      case 'time':
        return { noCalendar: true, enableTime: true, dateFormat: 'H:i' };
      default:
        return { dateFormat: 'Y-m-d' };
    }
  };

  return (
    <Flatpickr
      value={value || ''}
      options={getOptions()}
      className="form-input"
      onChange={handleChange}
    />
  );
};

export default DatePicker;
