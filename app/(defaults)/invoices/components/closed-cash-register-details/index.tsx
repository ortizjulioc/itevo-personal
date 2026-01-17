'use client';
import { Button, Input } from '@/components/ui';
import { Tab } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFormattedDateTime } from '@/utils/date';
import apiRequest from '@/utils/lib/api-request/request';
import { openNotification } from '@/utils';
import PrintClosure from '@/components/common/print/closure';
import Skeleton from '@/components/common/Skeleton';
import { CashRegister } from '../../lib/cash-register/use-fetch-cash-register';
import CashRegisterProductReport from '@/app/(defaults)/cash-registers/components/reports/cash-register-product-report';
import CashRegisterCourseReport from '@/app/(defaults)/cash-registers/components/reports/cash-register-course-report';

const billsList: Record<string, number> = {
  twoThousand: 2000,
  thousand: 1000,
  fiveHundred: 500,
  twoHundred: 200,
  hundred: 100,
  fifty: 50,
  twentyfive: 25,
  ten: 10,
  five: 5,
  one: 1,
};

export default function ClosedCashRegisterDetails({ CashRegister }: { CashRegister: CashRegister }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [closureData, setClosureData] = useState<any>(null);

  useEffect(() => {
    const fetchClosure = async () => {
      try {
        const response = await apiRequest.get<any>(`/cash-register/${CashRegister.id}/closure`);
        if (response.success && response.data) {
          setClosureData(response.data);
        } else {
          openNotification('error', response.message || 'Error al cargar el cierre de caja');
        }
      } catch (error) {
        console.error(error);
        openNotification('error', 'Error al cargar el cierre de caja');
      } finally {
        setLoading(false);
      }
    };

    fetchClosure();
  }, [CashRegister.id]);

  if (loading) return <Skeleton rows={6} />;

  if (!closureData) return <div>No se encontró información del cierre.</div>;

  const {
    cashBreakdown,
    totalCash,
    totalCard,
    totalCheck,
    totalTransfer,
    initialBalance,
    totalIncome,
    totalExpense,
    expectedTotal,
    difference,
    closureDate
  } = closureData;

  const totalCalculated = totalCash + totalCard + totalCheck + totalTransfer;

  return (
    <div className="mb-5">
      <div className="rounded border border-white-light bg-white shadow-sm dark:border-[#1b2e4b] dark:bg-[#191e3a] p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h4 className="text-xl font-bold">Detalle de Caja Cerrada</h4>
            <div className="text-sm text-gray-500">
              Cerrada el: {getFormattedDateTime(new Date(closureDate), { hour12: true })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/invoices')}>
              Volver
            </Button>
            <PrintClosure closureId={closureData.id} cashRegisterId={CashRegister.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 p-3 rounded dark:bg-[#0e1726]">
            <div className="text-gray-500 text-sm">Caja</div>
            <div className="font-bold text-lg">{CashRegister.cashBox.name}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded dark:bg-[#0e1726]">
            <div className="text-gray-500 text-sm">Cajero</div>
            <div className="font-bold text-lg">{CashRegister.user.name}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded dark:bg-[#0e1726]">
            <div className="text-gray-500 text-sm">Apertura</div>
            <div className="font-bold text-lg">{getFormattedDateTime(new Date(CashRegister.openingDate), { hour12: true })}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded dark:bg-[#0e1726]">
            <div className="text-gray-500 text-sm">Cierre</div>
            <div className="font-bold text-lg">{getFormattedDateTime(new Date(closureDate), { hour12: true })}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded dark:bg-[#0e1726]">
            <div className="text-gray-500 text-sm">Balance Inicial</div>
            <div className="font-bold text-lg">RD$ {initialBalance?.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen de Totales */}
          <div className="lg:col-span-1 border rounded p-4 dark:border-[#1b2e4b]">
            <h5 className="font-bold text-lg mb-4 border-b pb-2">Resumen Financiero</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Balance Inicial:</span>
                <span className="font-semibold">RD$ {initialBalance?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Efectivo en Caja:</span>
                <span className="font-semibold">RD$ {totalCash?.toLocaleString()}</span>
              </div>

              <div className={`border-t pt-2 mt-2 flex justify-between font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{difference >= 0 ? 'Sobrante:' : 'Faltante:'}</span>
                <span>RD$ {Math.abs(difference)?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Desglose */}
          <div className="lg:col-span-2 border rounded p-4 dark:border-[#1b2e4b]">
            <Tab.Group>
              <Tab.List className="flex flex-wrap border-b border-white-light dark:border-[#191e3a] mb-4">
                {['Efectivo', 'Otros Medios'].map((tab, idx) => (
                  <Tab as={Fragment} key={idx}>
                    {({ selected }) => (
                      <button
                        className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''} dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary outline-none`}
                      >
                        {tab}
                      </button>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2'>
                    {Object.entries(cashBreakdown || {}).map(([key, quantity]) => {
                      const denomination = billsList[key as keyof typeof billsList];
                      const total = (quantity as number) * denomination;
                      return (
                        <div key={key} className="flex justify-between items-center border-b border-gray-100 py-1 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold w-16">RD${denomination}</span>
                            <span className="text-gray-500">x {quantity as number}</span>
                          </div>
                          <span className="font-semibold">RD$ {total.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 text-right">
                    <div className="text-lg font-bold">Total Efectivo: RD$ {totalCash?.toLocaleString()}</div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded dark:bg-[#0e1726]">
                      <span className="font-semibold">Tarjetas</span>
                      <span className="text-lg">RD$ {totalCard?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded dark:bg-[#0e1726]">
                      <span className="font-semibold">Cheques</span>
                      <span className="text-lg">RD$ {totalCheck?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded dark:bg-[#0e1726]">
                      <span className="font-semibold">Transferencias</span>
                      <span className="text-lg">RD$ {totalTransfer?.toLocaleString()}</span>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 md:col-span-6">
          <CashRegisterProductReport cashRegisterId={CashRegister.id} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <CashRegisterCourseReport cashRegisterId={CashRegister.id} />
        </div>
      </div>
    </div >
  );
}
