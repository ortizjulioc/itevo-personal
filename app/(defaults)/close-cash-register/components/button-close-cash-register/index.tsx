'use client'
import ModalCashRegisterClose from '@/app/(defaults)/close-cash-register/components/modal-cash-register-close';
import { Button } from '@/components/ui';
import React from 'react'

export default function ButtonCloseCashRegister() {
    const [openModalCashRegister, setOpenModalCashRegister] = React.useState(false);
    return (
        <div>
            <Button type="button" className="w-full md:w-auto" onClick={()=>setOpenModalCashRegister(true) }>
                Cerrar caja
            </Button>
            <ModalCashRegisterClose setOpenModal={setOpenModalCashRegister} openModal={openModalCashRegister} />
        </div>
    )
}
