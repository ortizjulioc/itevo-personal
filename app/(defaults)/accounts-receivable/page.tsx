import { Metadata } from "next";
import AccountsReceivableClient from "./accounts-receivable-client";

export const metadata: Metadata = {
  title: 'Cuentas por cobrar',
};

export default async function AccountsReceivable({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  return <AccountsReceivableClient searchParams={params} />;
}
