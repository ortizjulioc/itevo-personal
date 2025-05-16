'use client';

import { IRootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import ReactSelect, { GroupBase, Props as ReactSelectProps, StylesConfig } from 'react-select';
import AsyncSelect, { AsyncProps } from 'react-select/async';

// Extend CustomSelectProps to support both ReactSelect and AsyncSelect props
type CustomSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option> // Add Group type parameter
> = (ReactSelectProps<Option, IsMulti, Group> | AsyncProps<Option, IsMulti, Group>) & {
  mode?: 'light' | 'dark'; // Light or dark mode
  asComponent?: React.ComponentType<ReactSelectProps<Option, IsMulti, Group> | AsyncProps<Option, IsMulti, Group>>;
  styles?: StylesConfig<Option, IsMulti, Group>; // Optional override for styles
};

// Define el tipo para opciones
interface OptionType {
  value: string | number;
  label: string;
}

// Estilos personalizados para modo claro y oscuro
const getCustomStyles = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  isDarkMode: boolean
): StylesConfig<Option, IsMulti, Group> => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: isDarkMode ? '#121E32' : '#ffffff', // Dark o White
    borderColor: state.isFocused
      ? '#4361EE' // Activo (Primario)
      : isDarkMode
        ? '#17263C' // Inactivo en oscuro
        : '#E0E6ED', // Inactivo en claro
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#4361EE', // Mantener color primario al pasar el mouse
    },
    borderRadius: '6px', // Bordes redondeados
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease', // Transiciones suaves
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? '#0e1726' : '#ffffff', // Black o White
    borderRadius: '8px',
    zIndex: 10,
    overflow: 'hidden',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? isDarkMode
        ? '#4361ee' // Primario
        : '#eaf1ff' // Primary-Light
      : 'transparent',
    color: isDarkMode
      ? state.isFocused
        ? '#ffffff' // Texto blanco al enfocar en oscuro
        : '#e0e6ed' // Texto gris claro en oscuro
      : state.isFocused
        ? '#4361ee' // Primario al enfocar
        : '#0e1726', // Texto negro en claro
    cursor: 'pointer',
    '&:active': {

    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: isDarkMode ? '#e0e6ed' : '#0e1726', // Gris claro o Negro
  }),
  placeholder: (provided) => ({
    ...provided,
    color: isDarkMode ? '#888ea8' : '#888ea8', // Misma tonalidad en ambos modos
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? '#17263C' : '#E0E6ED',
    borderRadius: '4px',
    padding: '2px 4px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: isDarkMode ? '#e0e6ed' : '#0e1726',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: isDarkMode ? '#e0e6ed' : '#0e1726',
    '&:hover': {
      backgroundColor: isDarkMode ? '#4361EE' : '#d7e3fc',
      color: '#ffffff',
    },
  }),
});

export default function Select<
  Option = OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option> // Add Group type parameter
>(props: CustomSelectProps<Option, IsMulti, Group>) {

  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const { mode, styles, asComponent: Component = ReactSelect, ...restProps } = props;
  const isDarkMode = Boolean(mode) ? mode === 'dark' ? true : false : themeConfig.isDarkMode

  return (
    <Component
      {...restProps}
      styles={{
        ...getCustomStyles<Option, IsMulti, Group>(isDarkMode),
        ...styles, // Permite sobrescribir estilos desde los props si es necesario
      }}
    />
  );
}
