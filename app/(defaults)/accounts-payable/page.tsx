import { Metadata } from 'next';
import AccountsPayableClient from './accounts-payable-client';

export const metadata: Metadata = {
  title: 'Cuentas por pagar',
};

export default async function AccountsPayable({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  return <AccountsPayableClient searchParams={params} />;
}
