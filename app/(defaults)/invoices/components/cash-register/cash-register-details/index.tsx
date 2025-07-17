import Dropdown from '@/components/dropdown';
import { Button } from '@/components/ui';
import { CashRegister as CashRegisterPrisma } from '@prisma/client'
import React from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi';
import CashRegisterClose from '../cash-register-close';
import { getFormattedDate, getFormattedDateTime } from '@/utils/date';


interface CashRegister extends CashRegisterPrisma {
    user: {
        id: string;
        name: string;
    }
}
export default function CashRegisterDetails({ CashRegister }: { CashRegister: CashRegister }) {

    const [openModal, setOpenModal] = React.useState(false);


    return (
        <div className="mb-5 flex items-center justify-center">
            <div className=" w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                {/* <div className="py-7 px-6 grid md:grid-cols-4 items-center gap-4"> */}
                <div className="flex items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="font-bold text-gray-800 dark:text-white"> Fecha de apertura:</span>
                        <span className=" text-gray-800 dark:text-white">{getFormattedDateTime(new Date(CashRegister.openingDate))}</span>
                    </div>
                    <div className="flex items-center gap-2  mb-4 md:mb-0 ">
                        <span className="font-bold text-gray-800 dark:text-white"> Caja:</span>
                        <span className=" text-gray-800 dark:text-white">{CashRegister.name}</span>
                    </div>
                    <div className="flex items-center gap-2  mb-4 md:mb-0">
                        <span className="font-bold text-gray-800 dark:text-white"> Usuario:</span>
                        <span className=" text-gray-800 dark:text-white">{CashRegister.user.name}</span>
                    </div>
                    <div className="flex justify-end items-center gap-2 mb-4 md:mb-0">
                        <div className="dropdown">
                            <Dropdown
                                button={<HiOutlineDotsVertical size={'24'} />}
                                btnClassName=""
                                placement="bottom-end"

                            >
                                <div className="!min-w-[170px]">
                                    <ul>
                                        <li>
                                            <button type="button" onClick={() => setOpenModal(true)} className="dropdown-item">
                                                cerrar caja
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    <CashRegisterClose
                        setOpenModal={setOpenModal}
                        openModal={openModal}
                    />

                </div>
            </div>
        </div>
    )
}
