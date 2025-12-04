export interface CashRegisterClosureResponse {
  id: string;
  closureDate: string;
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  cashBreakdown: any | null;
  totalCash: number;
  totalCheck: number;
  totalCard: number;
  totalTransfer: number;
  totalExpected: number;
  difference: number;
  expectedTotalCash: number;
  expectedTotalCard: number;
  expectedTotalCheck: number;
  expectedTotalTransfer: number;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    name: string;
    lastName: string;
  };

  cashRegister: {
    id: string;
    openingDate: string;
    initialBalance: number;

    cashBox: {
      id: string;
      name: string;

      branch: {
        id: string;
        name: string;
        address: string;
        phone: string | null;
        email: string | null;
      };
    };
  };
}

export type CashMovementResponse = {
  id: string;
  cashRegisterId: string;
  type: "INCOME" | "EXPENSE"; // o los valores de tu enum CashMovementType
  amount: number;
  description: string | null;
  referenceType: "INVOICE" | "RECEIVABLE_PAYMENT" | "PAYABLE_PAYMENT" | "DISBURSEMENT" | null;
  referenceId: string | null;
  createdBy: string;
  createdAt: string;     // Date convertido a string en JSON
  updatedAt: string;     // Date → string
  deleted: boolean;

  cashRegister: {
    id: string;
    cashBox: {
      id: string;
      branch: {
        id: string;
        name: string;
        address: string;
        phone: string | null;
        email: string | null;
      };
    };
  },

  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    lastName: string;
    phone: string;
    password: string | null;
    search: string | null;
    inactive: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

