'use client';
import Dropdown from '@/components/dropdown';
import { Button } from '@/components/ui';
import React, { useEffect } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { getFormattedDateTime } from '@/utils/date';
import TeacherPayment from '../../teacher-payment';
import { useRouter, usePathname } from 'next/navigation';
import useFetchInvoices from '@/app/(defaults)/bills/lib/use-fetch-invoices';
import { openNotification } from '@/utils';
import AttendanceModal from '@/app/(defaults)/attendances/components/attendance-modal';
import Swal from 'sweetalert2';
import ModalCashRegisterClose from '@/app/(defaults)/cash-registers/components/modal-cash-register-close';

 export interface CashRegister {
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
  };
  createdAt: string;
  updatedAt: string;
}

export default function CashRegisterDetails({ CashRegister }: { CashRegister: CashRegister }) {
  const [openModalTeacher, setOpenModalTeacher] = React.useState(false);
  const [openModalAttendance, setOpenModalAttendance] = React.useState(false);
  const { invoices, fetchInvoicesData } = useFetchInvoices(CashRegister.id);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);
  const [openModalClose, setOpenModalClose] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
  if (!CashRegister?.id) return;

  if (CashRegister.status === 'CLOSED') {
    Swal.fire({
      title: 'Caja cerrada',
      text: 'Esta caja ya fue cerrada y no puede ser modificada.',
      icon: 'warning',
      confirmButtonText: 'Ir a facturación',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      router.push('/invoices');
    });
    return; // 👈 evita ejecutar fetchInvoicesData después
  }

  fetchInvoicesData(CashRegister.id);
  // Solo ejecuta si cambia el id de la caja
}, [CashRegister.id]);

  const draftInvoices = invoices?.filter(inv => inv.status === 'DRAFT') || [];
  const hasPendingInvoices = draftInvoices.length > 0;

  return (
    <div className="mb-5 flex items-center justify-center">
      <div className="w-full rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <span className="font-bold text-gray-800 dark:text-white">Fecha de apertura:</span>
            <span className="text-gray-800 dark:text-white">{getFormattedDateTime(new Date(CashRegister.openingDate), { hour12: true })}</span>
          </div>
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <span className="font-bold text-gray-800 dark:text-white">Caja:</span>
            <span className="text-gray-800 dark:text-white">{CashRegister.cashBox.name}</span>
          </div>
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <span className="font-bold text-gray-800 dark:text-white">Usuario:</span>
            <span className="text-gray-800 dark:text-white">{CashRegister.user.name}</span>
          </div>
          <div className="mb-4 flex items-center justify-end gap-2 md:mb-0">
            <div className="dropdown">
              <Dropdown
                open={dropdownOpen}
                onToggle={setDropdownOpen}
                button={
                  loadingAction ? (
                    <span className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin inline-block" />
                  ) : (
                    <HiOutlineDotsVertical size={20} />
                  )
                }
                btnClassName=""
                placement="bottom-end"
              >
                <div className="!min-w-[200px]">
                  <ul className="divide-white-light dark:divide-white-light/10">
                    <li>
                      <button
                        type="button"
                        disabled={loadingAction !== null}
                        onClick={async () => {
                          setLoadingAction('attendance');
                          await new Promise((res) => setTimeout(res, 200));
                          setOpenModalAttendance(true);
                          setLoadingAction(null);
                        }}
                        className="dropdown-item w-full flex items-center gap-2"
                      >
                        {loadingAction === 'attendance' && (
                          <span className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        )}
                        Registro de asistencia
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        disabled={loadingAction !== null}
                        onClick={async () => {
                          setLoadingAction('teacher');
                          await new Promise((res) => setTimeout(res, 200));
                          setOpenModalTeacher(true);
                          setLoadingAction(null);
                        }}
                        className="dropdown-item w-full flex items-center gap-2"
                      >
                        {loadingAction === 'teacher' && (
                          <span className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        )}
                        Desembolso a profesor
                      </button>
                    </li>
                    <li className="border-t">
                      <button
                        type="button"
                        disabled={loadingAction !== null}
                        onClick={async () => {
                          setLoadingAction('close');
                          if (hasPendingInvoices) {
                            openNotification('error', 'No puede hacer cierre de caja, aún tiene facturas pendientes');
                            setLoadingAction(null);
                            return;
                          }
                          await new Promise((res) => setTimeout(res, 200));
                          setOpenModalClose(true);
                          setLoadingAction(null);
                        }}
                        className="dropdown-item w-full flex items-center gap-2"
                      >
                        {loadingAction === 'close' && (
                          <span className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                        )}
                        Cerrar caja
                      </button>
                    </li>
                  </ul>
                </div>
              </Dropdown>
            </div>
          </div>
          <TeacherPayment setOpenModal={setOpenModalTeacher} openModal={openModalTeacher} />
          <AttendanceModal setOpenModal={setOpenModalAttendance} openModal={openModalAttendance} />
          <ModalCashRegisterClose setOpenModal={setOpenModalClose} openModal={openModalClose} />
        </div>
      </div>
    </div>
  );
}
