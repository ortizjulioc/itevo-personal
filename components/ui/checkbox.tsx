import classNames from 'classnames';
import React from 'react'

interface CheckboxProps {
  children?: React.ReactNode
  checked?: boolean
  className?: string
  onChange?: (checked: boolean) => void,
  color?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark',
  variant?: 'solid' | 'outline',
  textColored?: boolean
}

const MAP_COLOR = {
  primary: 'text-primary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  secondary: 'text-secondary',
  dark: 'text-dark',
};

const MAP_OUTLINE_COLOR = {
  primary: 'outline-primary',
  info: 'outline-info',
  success: 'outline-success',
  warning: 'outline-warning',
  danger: 'outline-danger',
  secondary: 'outline-secondary',
  dark: 'outline-dark',
};

const MAP_TEXT_COLORED = {
  primary: 'peer-checked:text-primary',
  info: 'peer-checked:text-info',
  success: 'peer-checked:text-success',
  warning: 'peer-checked:text-warning',
  danger: 'peer-checked:text-danger',
  secondary: 'peer-checked:text-secondary',
  dark: 'peer-checked:text-dark',
};

export default function Checkbox({
  children,
  checked,
  className,
  onChange,
  color = 'primary',
  variant = 'solid',
  textColored = false
}: CheckboxProps) {

  const getVariantClass = () => {
    switch (variant) {
      case 'solid':
        return MAP_COLOR[color]
      case 'outline':
        return MAP_OUTLINE_COLOR[color]
      default:
        return ''
    }
  }

  const checkboxClasses = classNames(
    'form-checkbox',
    getVariantClass(),
    { 'peer': textColored },
    className
  )

  return (
    <label className="inline-flex hover:cursor-pointer">
      <input
        type="checkbox"
        className={checkboxClasses}
      />
      <span
        className={classNames({[MAP_TEXT_COLORED[color]]: textColored})}
      >{children}</span>
    </label >
  )
}
