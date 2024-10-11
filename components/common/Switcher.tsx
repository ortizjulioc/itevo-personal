import React, { ChangeEvent } from 'react';
import classNames from 'classnames';

interface CustomSwitchProps {
  id?: string;
  checked?: boolean;
  checkedContent?: React.ReactNode;
  className?: string;
  color?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  labelRef?: React.Ref<HTMLLabelElement>;
  name?: string;
  onChange?: (checked: boolean, id?: string) => void; // Cambiamos la firma de onChange
  readOnly?: boolean;
  unCheckedContent?: React.ReactNode;
  field?: string;
}

const Switcher: React.FC<CustomSwitchProps> = ({
  id,
  checked,
  checkedContent,
  className,
  color = 'primary',
  defaultChecked = false,
  disabled = false,
  isLoading = false,
  labelRef,
  name,
  onChange,
  readOnly = false,
  unCheckedContent,
  field,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked, id); // Ahora enviamos el valor boolean y el id
    }
  };

  return (
    <label
      ref={labelRef}
      className={classNames("w-12 h-6 relative", className, {
        'cursor-not-allowed': disabled || isLoading,
      })}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange} // Usamos la nueva función handleChange
        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
      />
      <span
        className={classNames(
          "outline_checkbox block h-full rounded-full border-2 before:absolute before:bottom-1 before:w-4 before:h-4 before:rounded-full before:transition-all before:duration-300",
          {
            [`peer-checked:border-${color}`]: color,
            'peer-checked:before:bg-primary': checked,
            'bg-icon': !checked,
            'border-[#ebedf2] dark:border-white-dark': !checked,
          }
        )}
      >
        {checked ? checkedContent : unCheckedContent}
      </span>
    </label>
  );
};

export default Switcher;
