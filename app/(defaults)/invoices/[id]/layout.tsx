'use client';
import React, { use } from 'react';
import { useFetchCashRegistersById } from '../lib/cash-register/use-fetch-cash-register';
import CashRegisterDetails from '../components/cash-register/cash-register-details';
import { ViewTitle } from '@/components/common';
import InvoiceList from '../components/invoice/invoices-list';
import { GenericSkeleton } from '@/components/common/Skeleton';
import { useSession } from 'next-auth/react';
import { IconLock } from '@/components/icon';

interface CashRegister {
  id: string;
  status: string;
  openingDate: string;
  initialBalance: number;
  deleted: boolean;
  user: {
    id: string;
    name: string;
  };
  cashBox: {
    id: string;
    name: string;
    branchId: string;
    branch: {
        name: string;
    }
  };
  createdAt: string;
  updatedAt: string;
}

export default function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { loading, CashRegister } = useFetchCashRegistersById(id);

  const activeBranchId = (session?.user as any)?.activeBranchId;
  const cashRegisterBranchId = (CashRegister as any)?.cashBox?.branchId;
  const isCorrectBranch = !activeBranchId || !cashRegisterBranchId || activeBranchId === cashRegisterBranchId;

  return (
    <div className="px-2 md:px-6">
      <ViewTitle title="Facturación" className="mb-6" />

      {loading ? (
        <GenericSkeleton className="mb-6" lines={6} withHeader={false} />
      ) : (
        <>
          {CashRegister && (
            <CashRegisterDetails
              CashRegister={CashRegister as unknown as CashRegister}
            />
          )}

          {!isCorrectBranch ? (
            <div className="mt-12 flex flex-col items-center justify-center p-10 panel bg-danger-light border-danger text-danger">
                <div className="bg-danger text-white p-4 rounded-full mb-4">
                    <IconLock className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-extrabold mb-2 text-center uppercase">Sucursal Incorrecta</h2>
                <p className="text-lg text-center max-w-md">
                    Esta caja registradora pertenece a la sucursal <span className="font-bold">{(CashRegister as any).cashBox.branch.name}</span>.
                </p>
                <p className="mt-4 font-medium text-center italic">
                    Por favor, cambia tu sucursal activa en la parte superior derecha para poder operar con esta caja.
                </p>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="mb-3 text-2xl font-bold">Facturas</h2>
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="w-full md:w-[15rem]">
                  <InvoiceList cashRegisterId={id} userId={(session?.user as any)?.id || (CashRegister as any)?.user?.id} />
                </div>

                <div className="w-full">{children}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}