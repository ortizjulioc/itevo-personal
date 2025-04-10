export const NCF_TYPES = {
    FACTURA_CREDITO_FISCAL: {
      code: "01",
      label: "Factura de Crédito Fiscal"
    },
    FACTURA_CONSUMO: {
      code: "02",
      label: "Factura de Consumo"
    },
    NOTA_DEBITO: {
      code: "03",
      label: "Nota de Débito"
    },
    NOTA_CREDITO: {
      code: "04",
      label: "Nota de Crédito"
    },
    COMPROBANTE_COMPRAS: {
      code: "11",
      label: "Comprobante de Compras"
    },
    REGISTRO_UNICO_INGRESOS: {
      code: "12",
      label: "Registro Único de Ingresos"
    },
    GASTOS_MENORES: {
      code: "13",
      label: "Comprobante para Gastos Menores"
    },
    REGIMENES_ESPECIALES: {
      code: "14",
      label: "Comprobante para Regímenes Especiales"
    },
    GUBERNAMENTAL: {
      code: "15",
      label: "Comprobante Gubernamental"
    },
    EXPORTACION: {
      code: "16",
      label: "Comprobante para Exportaciones"
    },
    PAGO_EXTERIOR: {
      code: "17",
      label: "Comprobante para Pagos al Exterior"
    }
  } as const;
  