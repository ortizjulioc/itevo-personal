'use client'

import { Button } from '@/components/ui';
import React from 'react'
import ModalCashRegisterClose from '../modal-cash-register-close';

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
