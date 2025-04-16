import React from 'react'
import NewinvoiceCard from './new-invoice-card'

export default function InvoiceList({ cashRegisterId,userId}: { cashRegisterId?: string,userId?: string }) {
    return (
        <div className="mb-5 flex items-center justify-center">
            <div className="max-w-[22rem] w-full ">
                
               <NewinvoiceCard
                cashRegisterId={cashRegisterId}
                userId={userId}
                />

            </div>
        </div>
    )
}
