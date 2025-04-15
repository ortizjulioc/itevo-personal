import { Button } from '@/components/ui';
import React from 'react'
import { CiCirclePlus } from "react-icons/ci";
export default function NewinvoiceCard() {
    return (
        <Button className="justify-items-center flex-row max-w-[20rem] w-full
         bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] 
         dark:bg-[#191e3a] dark:shadow-none p-5 "
            variant='outline'>

            <CiCirclePlus className='size-10' />

            <span className=''>Nueva Factura</span>
        </Button>
    )
}
