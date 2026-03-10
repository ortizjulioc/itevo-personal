export type NcfType =
  | "FACTURA_CREDITO_FISCAL"
  | "FACTURA_CONSUMO"
  | "NOTA_DEBITO"
  | "NOTA_CREDITO"
  | "COMPROBANTE_COMPRAS"
  | "REGISTRO_UNICO_INGRESOS"
  | "GASTOS_MENORES"
  | "REGIMENES_ESPECIALES"
  | "GUBERNAMENTAL"
  | "EXPORTACION"
  | "PAGO_EXTERIOR";

type NcfTypeMap = {
  [key in NcfType]: {
    code: NcfType;
    label: string;
  };
};

export const NCF_TYPES: NcfTypeMap = {
  FACTURA_CREDITO_FISCAL: {
    code: "FACTURA_CREDITO_FISCAL",
    label: "Factura de Crédito Fiscal"
  },
  FACTURA_CONSUMO: {
    code: "FACTURA_CONSUMO",
    label: "Factura de Consumo"
  },
  NOTA_DEBITO: {
    code: "NOTA_DEBITO",
    label: "Nota de Débito"
  },
  NOTA_CREDITO: {
    code: "NOTA_CREDITO",
    label: "Nota de Crédito"
  },
  COMPROBANTE_COMPRAS: {
    code: "COMPROBANTE_COMPRAS",
    label: "Comprobante de Compras"
  },
  REGISTRO_UNICO_INGRESOS: {
    code: "REGISTRO_UNICO_INGRESOS",
    label: "Registro Único de Ingresos"
  },
  GASTOS_MENORES: {
    code: "GASTOS_MENORES",
    label: "Comprobante para Gastos Menores"
  },
  REGIMENES_ESPECIALES: {
    code: "REGIMENES_ESPECIALES",
    label: "Comprobante para Regímenes Especiales"
  },
  GUBERNAMENTAL: {
    code: "GUBERNAMENTAL",
    label: "Comprobante Gubernamental"
  },
  EXPORTACION: {
    code: "EXPORTACION",
    label: "Comprobante para Exportaciones"
  },
  PAGO_EXTERIOR: {
    code: "PAGO_EXTERIOR",
    label: "Comprobante para Pagos al Exterior"
  }
} as const;
