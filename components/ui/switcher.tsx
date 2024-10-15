import classNames from 'classnames';
import React from 'react';

interface SwitcherProps {
  checked?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
  border?: 'default' | 'rounded';
  variant?: 'solid' | 'outline';
}

const BORDER_CLASS_MAP = {
  default: '',
  rounded: 'rounded-full',
};

const VARIANT_CLASS_MAP = {
  solid: 'bg-[#ebedf2] before:bg-white dark:bg-dark dark:peer-checked:before:bg-white peer-checked:bg-primary',
  outline: 'outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark before:bg-[#ebedf2] peer-checked:border-primary peer-checked:before:bg-primary',
};

const Switcher = ({
  checked,
  className,
  onChange,
  border = 'default',
  variant = 'solid',
}: SwitcherProps) => {
  return (
    <label className={classNames('w-12 h-6 relative', className)}>
      <input
        type="checkbox"
        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
        id="custom_switch_checkbox1"
        checked={checked}
        onChange={() => onChange && onChange(!checked)}
      />
      <span
        className={classNames(
          'block h-full',
          BORDER_CLASS_MAP[border],
          VARIANT_CLASS_MAP[variant],
          'before:absolute before:left-1 dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 before:transition-all before:duration-300'
        )}
      ></span>
    </label>
  );
};

export default Switcher;
