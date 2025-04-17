
'use client';
import { Button, Checkbox, FormItem, Input, Select } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import type { Invoice, InvoiceItem, InvoiceItemType } from '@prisma/client';
import { payInvoice } from '@/app/(defaults)/invoices/lib/invoice/invoice-request';
import { useState } from 'react';
import SelectProduct from '@/components/common/selects/select-product';




export default function AddItemsInvoices({ Invoice }: { Invoice: Invoice }) {

    const route = useRouter();
    const [item, setItem] = useState<InvoiceItem | null>(null);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleSubmit = async (values: any) => {


        const resp = await payInvoice(Invoice.id, values);


        if (resp.success) {
            openNotification('success', 'Invoiceso editado correctamente');
            route.push('/Invoicess');
        } else {
            alert(resp.message);
        }
    }



    return (
        <div className="panel">
           

            <div className="mb-4  grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 w-full">
                            <SelectProduct
                                value={item?.productId ?? undefined}
                                onChange={(selected) => {
                                    setItem((prev) => ({
                                        ...prev!,
                                        productId: selected?.value ?? null,
                                    }));
                                }}
                            />
                        </div>
                        <div className="w-1/4">
                            <Input
                                placeholder="Cantidad"
                                type="number"
                                value={item?.quantity ?? ''}
                                onChange={(e) => {
                                    setItem((prev) => ({
                                        ...prev!,
                                        quantity: Number(e.target.value),
                                    }));
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button type="button" color="danger" onClick={() => route.back()}>
                    Cancelar
                </Button>
                <Button type="button" color="primary" onClick={() => route.push('/invoices')}>
                    Imprimir
                </Button>
                <Button type="button" color="success" onClick={() => route.push('/invoices')}>
                    Completar
                </Button>
            </div>



        </div>
    );
}
