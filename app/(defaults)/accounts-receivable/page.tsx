import { Metadata } from "next";
import AccountsReceivableClient from "./accounts-receivable-client";

export const metadata: Metadata = {
  title: 'Cuentas por cobrar',
};

export default function AccountsReceivable() {
  return <AccountsReceivableClient />;
}
