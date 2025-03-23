import { PatternFormat, PatternFormatProps } from 'react-number-format';
import { Input } from '../ui';

// Tipos para NumberInput
interface NumberInputProps {
    value: string | number;
    inputSuffix?: string;
    inputPrefix?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [x: string]: any; // Permitir props adicionales
}

const NumberInput: React.FC<NumberInputProps> = ({
    inputSuffix,
    inputPrefix,
    ...props
}) => {
    return (
        <Input
            {...props}
            value={props.value}
        />
    );
};

// Tipos para NumberFormatInput
interface NumberFormatInputProps extends Omit<PatternFormatProps, 'customInput' | 'onValueChange'> {
    form?: any;
    field?: any;
    onValueChange?: (values: any) => void;
}

const NumberFormatInput: React.FC<NumberFormatInputProps> = ({
    onValueChange,
    form,
    field,
    ...rest
}) => {
    return (
        <PatternFormat
            customInput={NumberInput}
            form={form}
            field={field}
            onBlur={field?.onBlur}
            onValueChange={onValueChange}
            {...rest}
        />
    );
};

// Tipos para FormPatternInput
interface FormPatternInputProps extends NumberFormatInputProps {
    inputSuffix?: string;
    inputPrefix?: string;
}

const FormPatternInput: React.FC<FormPatternInputProps> = ({
    form,
    field,
    inputSuffix,
    inputPrefix,
    onValueChange,
    ...rest
}) => {
    return (
        <NumberFormatInput
            form={form}
            field={field}
            onValueChange={onValueChange}
            {...rest}
        />
    );
};

export default FormPatternInput;
