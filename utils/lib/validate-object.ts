interface ValidateObjectInput {
    object: Record<string, any>;
    keysRequired: string[];
  }

  interface ValidationResult {
    isValid: boolean;
    message: string;
  }

  export const validateObject = ({ object, keysRequired }: ValidateObjectInput): ValidationResult => {
    const emptyFields: string[] = [];

    for (const key of keysRequired) {
      if (!object[key]) {
        emptyFields.push(key);
      }
    }

    const isValid = emptyFields.length === 0;

    const message = (): string => {
      if (isValid) {
        return '';
      }
      if (emptyFields.length === 1) {
        return `El campo '${emptyFields[0]}' es requerido.`;
      }

      const fieldMessage = `Los campos '${emptyFields.join(', ')}' son requeridos`;
      return fieldMessage.split('').reverse().join('').replace(',', 'y ').split('').reverse().join('');
    };

    return {
      isValid,
      message: message(),
    };
  };
