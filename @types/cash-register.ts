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
      };
    };
  };
}
