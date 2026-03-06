import { queryStringToObject } from '@/utils/object-to-query-string';
import React from 'react'
import { formatCurrency, getInitials, openNotification } from '@/utils';
import Skeleton from '@/components/common/Skeleton';
import { Pagination } from '@/components/ui';
import { AccountPayableWithRelations } from '@/@types/accounts-payables';
import Link from 'next/link';
import Avatar from '@/components/common/Avatar';
import useFetchAccountsPayable from '../../../invoices/lib/accounts-payable/use-fetch-accounts-payable';
import { PaymentStatus } from '@/generated/prisma/client';
import OptionalInfo from '@/components/common/optional-info';

type AccountsPayableListProps = {
  className?: string;
  query?: string;
}

const statusColors: Record<PaymentStatus, string> = {
  PENDING: 'bg-warning text-white',
  PAID: 'bg-success text-white',
  CANCELED: 'bg-danger text-white',
};

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  CANCELED: 'Cancelado',
};

export default function AccountsPayableList({ className, query }: AccountsPayableListProps) {
  const params = queryStringToObject(query || '');
  const {
    loading,
    error,
    accountsPayable,
    totalAccountsPayable,
  } = useFetchAccountsPayable(query || '');

  if (error) {
    console.error(error);
    openNotification('error', error);
  }

  if (loading) return <Skeleton rows={6} columns={['#', 'PROFESOR', 'CURSO', 'FECHA', 'ESTADO', 'MONTO', 'MONTO PAGADO']} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0">
        <table className="table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>PROFESOR</th>
              <th>CURSO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>MONTO</th>
              <th>MONTO PAGADO</th>
            </tr>
          </thead>
          <tbody>
            {accountsPayable?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron cuentas por pagar registradas</td>
              </tr>
            )}
            {accountsPayable?.map((payable: AccountPayableWithRelations, index: number) => {
              return (
                <tr key={payable.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="ml-2 flex items-center gap-2 rounded-md px-2 py-1 transition-colors">
                      <Avatar initials={getInitials(payable.teacher.firstName, payable.teacher.lastName)} size="sm" color="primary" />
                      <div className="flex flex-col">
                        <span className='min-w-max'>{`${payable.teacher.firstName} ${payable.teacher.lastName}`}</span>
                        <span className="font-semibold">{payable.teacher.code}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <OptionalInfo
                      content={payable?.courseBranch?.course?.name || ''}
                      message="Sin curso asignado"
                    />
                  </td>
                  <td>{new Date(payable.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[payable.status]}`}>
                      {statusLabels[payable.status]}
                    </span>
                  </td>
                  <td><span className='font-bold'>{formatCurrency(payable.amount)}</span></td>
                  <td><span className='font-bold text-success'>{formatCurrency(payable.amountDisbursed)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
      <div className="">
        <Pagination
          currentPage={parseInt(params?.page || '1')}
          total={totalAccountsPayable}
          top={parseInt(params?.top || '10')}
        />
      </div>
    </div>
  )
}
