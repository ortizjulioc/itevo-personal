export const formatPhoneNumber = (phone?: string | null): string => {
    // Si no hay número de teléfono, retornamos un string vacío
    if (!phone) {
      return '';
    }
    // Eliminar caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');

    // Verificar si tiene la longitud adecuada (10 dígitos)
    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    // Si no tiene la longitud esperada o no es válido, retornamos el número sin cambios
    return phone;
  }

  export const getInitials = (name: string, lastName: string) =>
    `${name[0].toUpperCase()}${lastName[0].toUpperCase()}`;
