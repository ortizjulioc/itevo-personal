import { NcfType } from "@prisma/client";

export const NCF_TYPES = {
  FACTURA_CREDITO_FISCAL: {
    code: NcfType.FACTURA_CREDITO_FISCAL,
    label: "Factura de Crédito Fiscal"
  },
  FACTURA_CONSUMO: {
    code: NcfType.FACTURA_CONSUMO,
    label: "Factura de Consumo"
  },
  NOTA_DEBITO: {
    code: NcfType.NOTA_DEBITO,
    label: "Nota de Débito"
  },
  NOTA_CREDITO: {
    code: NcfType.NOTA_CREDITO,
    label: "Nota de Crédito"
  },
  COMPROBANTE_COMPRAS: {
    code: NcfType.COMPROBANTE_COMPRAS,
    label: "Comprobante de Compras"
  },
  REGISTRO_UNICO_INGRESOS: {
    code: NcfType.REGISTRO_UNICO_INGRESOS,
    label: "Registro Único de Ingresos"
  },
  GASTOS_MENORES: {
    code: NcfType.GASTOS_MENORES,
    label: "Comprobante para Gastos Menores"
  },
  REGIMENES_ESPECIALES: {
    code: NcfType.REGIMENES_ESPECIALES,
    label: "Comprobante para Regímenes Especiales"
  },
  GUBERNAMENTAL: {
    code: NcfType.GUBERNAMENTAL,
    label: "Comprobante Gubernamental"
  },
  EXPORTACION: {
    code: NcfType.EXPORTACION,
    label: "Comprobante para Exportaciones"
  },
  PAGO_EXTERIOR: {
    code: NcfType.PAGO_EXTERIOR,
    label: "Comprobante para Pagos al Exterior"
  }
} as const;
