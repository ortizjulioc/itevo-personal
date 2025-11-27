import { IdentificationType } from "@prisma/client";

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

export const getInitials = (name?: string | null, lastName?: string | null): string => {
  // Verificar si name o lastName son nulos o indefinidos, y asignar un valor por defecto
  const firstInitial = name ? name[0].toUpperCase() : '';
  const lastInitial = lastName ? lastName[0].toUpperCase() : '';

  return `${firstInitial}${lastInitial}`;
}


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

export function formatIdentification(identification: string, type?: IdentificationType): string {
  if (type === IdentificationType.CEDULA) {
    return identification.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  if (type === IdentificationType.PASAPORTE) {
    return identification.toUpperCase();
  }
  if (type === IdentificationType.OTRO) {
    return identification;
  }
  return identification;
}
