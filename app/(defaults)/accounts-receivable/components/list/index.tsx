import { queryStringToObject } from '@/utils/object-to-query-string';
import React from 'react'
import useFetchAccountsReceivables from '../../lib/use-fetch-accounts-receivables';
import { formatCurrency, getInitials, openNotification } from '@/utils';
import Skeleton from '@/components/common/Skeleton';
import { Pagination } from '@/components/ui';
import { AccountReceivableWithRelations } from '@/@types/accounts-receivables';
import Link from 'next/link';
import Avatar from '@/components/common/Avatar';
import { getFormattedDate } from '@/utils/date';

type AccountsReceivableListProps = {
  className?: string;
  query?: string;
}

export default function AccountsReceivableList({ className, query }: AccountsReceivableListProps) {
  const params = queryStringToObject(query || '');
  const {
    loading,
    error,
    accountsReceivable,
    totalAccountsReceivable,
  } = useFetchAccountsReceivables(query || '');

  if (error) {
    console.error(error);
    openNotification('error', error);
  }
  console.log(accountsReceivable);
  if (loading) return <Skeleton rows={6} columns={['FECHA DE VENCIMIENTO', 'ESTUDIANTE', 'CURSO', "ESTADO"]} />;

  return (
    <div className={className}>
      <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
        <table className="table-hover">
          <thead>
            <tr>
              <th>ESTUDIANTE</th>
              <th>CURSO</th>
              <th>FECHA DE VENCIMIENTO</th>
              <th>MONTO</th>
              <th>ESTADO</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {accountsReceivable?.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron cuentas por cobrar registradas</td>
              </tr>
            )}
            {accountsReceivable?.map((receivable: AccountReceivableWithRelations) => {
              return (
                <tr key={receivable.id}>
                  <td>
                    <Link href={`/students/view/${receivable.student.id}`} className="ml-2 flex items-center gap-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition-colors">
                      <Avatar initials={getInitials(receivable.student.firstName, receivable.student.lastName)} size="sm" color="primary" />
                      <div className="flex flex-col">
                        <span className='min-w-max'>{`${receivable.student.firstName} ${receivable.student.lastName}`}</span>
                        <span className="font-semibold">{receivable.student.code}</span>
                      </div>
                    </Link>
                  </td>
                  <td>{receivable.courseBranch.course.name}</td>
                  <td>{getFormattedDate(new Date(receivable.dueDate))}</td>
                  <td><span className='font-bold'>{formatCurrency(receivable.amount)}</span></td>
                  <td>{receivable.status}</td>
                  <td><span>Detalles</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
      <div className="">
        <Pagination
          currentPage={parseInt(params?.page || '1')}
          total={totalAccountsReceivable}
          top={parseInt(params?.top || '10')}
        />
      </div>
    </div>
  )
}
