import { Metadata } from "next";
import AccountsReceivableClient from "./accounts-receivable-client";

export const metadata: Metadata = {
  title: 'Cuentas por cobrar',
};

export default function AccountsReceivable({ searchParams }: { searchParams?: { [key: string]: string } }) {
  return <AccountsReceivableClient searchParams={searchParams} />;
}
