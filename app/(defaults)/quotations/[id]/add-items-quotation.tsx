'use client';

import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { confirmDialog, formatCurrency, openNotification } from '@/utils';
import { useState, useRef, useEffect } from 'react';
import { TbCancel, TbCheck, TbX, TbPrinter } from 'react-icons/tb';
import { InvoiceItemType, Student, StudentScholarship, Scholarship } from '@/generated/prisma/client';
import { useQuotation } from './quotation-provider';

type StudentWithScholarships = Student & {
    scholarships: (StudentScholarship & {
        scholarship: Scholarship;
    })[];
};
import apiRequest from '@/utils/lib/api-request/request';
import SelectProduct, { ProductSelect } from '@/components/common/selects/select-product';
import SelectStudent, { StudentSelect } from '@/components/common/selects/select-student';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import ProductLabel from '@/components/common/info-labels/product-label';
import { HiOutlineDocumentText } from 'react-icons/hi';
import OptionalInfo from '@/components/common/optional-info';
import QuotationPDFModal from './components/quotation-pdf-modal';

export default function AddItemsQuotation() {
    const { quotation, setQuotation, fetchQuotationData } = useQuotation();
    const router = useRouter();

    const productRef = useRef<HTMLSelectElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);

    const [itemLoading, setItemLoading] = useState(false);
    const [openPrintModal, setOpenPrintModal] = useState(false);

    // Form states
    const [student, setStudent] = useState<string | null>(quotation?.studentId || null);
    const [activeStudent, setActiveStudent] = useState<any>(null);
    const [productItem, setProductItem] = useState<{ productId: string, unitPrice: number, quantity: number, name: string } | null>(null);
    const [courseBranch, setCourseBranch] = useState<{ id: string, name: string, enrollment: number, amount: number, installments: number } | null>(null);
    const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
    const [quotationConcept, setQuotationConcept] = useState(quotation?.concept || '');

    // Handlers
    const onChangeStudent = async (selected: StudentSelect | null) => {
        const studentId = selected?.value ?? null;
        setStudent(studentId);

        if (selected) {
            try {
                const resp = await apiRequest.get<StudentWithScholarships>(`students/${selected.value}`);
                if (resp.success && resp.data) {
                    setActiveStudent(resp.data);
                    // Seleccionar la primera beca activa por defecto si existe
                    if (resp.data.scholarships && resp.data.scholarships.length > 0) {
                        setSelectedScholarship(resp.data.scholarships[0]);
                    } else {
                        setSelectedScholarship(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching student details:', error);
            }
        } else {
            setActiveStudent(null);
            setSelectedScholarship(null);
        }

        try {
            const resp = await apiRequest.put<any>(`quotations/${quotation.id}`, { studentId });
            if (resp.success) {
                openNotification('success', 'Estudiante asignado a la cotización');
                fetchQuotationData(quotation.id);
            } else {
                openNotification('error', 'Error al actualizar estudiante');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (quotation?.studentId && !activeStudent) {
            const fetchStudent = async () => {
                try {
                    const resp = await apiRequest.get<StudentWithScholarships>(`students/${quotation.studentId}`);
                    if (resp.success && resp.data) {
                        setActiveStudent(resp.data);
                    }
                } catch (error) {
                    console.error('Error fetching student details on mount:', error);
                }
            };
            fetchStudent();
        }
    }, [quotation?.studentId, activeStudent]);

    useEffect(() => {
        if (quotation?.concept !== undefined) {
            setQuotationConcept(quotation.concept || '');
        }
    }, [quotation?.concept]);

    const handleAddProduct = async () => {
        if (!productItem || !productItem.productId || !productItem.quantity) {
            openNotification('warning', 'Selecciona un producto y cantidad válida');
            return;
        }

        setItemLoading(true);
        try {
            const payload = {
                type: InvoiceItemType.PRODUCT,
                productId: productItem.productId,
                concept: productItem.name,
                quantity: productItem.quantity,
                unitPrice: productItem.unitPrice,
                subtotal: productItem.quantity * productItem.unitPrice,
                itbis: 0,
            };

            const resp = await apiRequest.post<any>(`quotations/${quotation.id}/items`, payload);
            if (resp.success) {
                openNotification('success', 'Producto agregado');
                setProductItem(null);
                fetchQuotationData(quotation.id);
            } else {
                openNotification('error', resp.message || 'Error al agregar');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setItemLoading(false);
        }
    };

    const handleAddCourseBranch = async () => {
        if (!courseBranch) {
            openNotification('warning', 'Selecciona una oferta académica válida');
            return;
        }

        setItemLoading(true);
        try {
            const itemsToCreate = [];

            // BECAS: Detectar becas si hay una seleccionada
            let enrollmentPrice = courseBranch.enrollment;
            let installmentPrice = courseBranch.amount;
            let enrollmentDiscount = 0;
            let installmentDiscount = 0;
            let conceptSuffix = "";

            if (selectedScholarship) {
                const { scholarship } = selectedScholarship;
                const { type, value, name } = scholarship;
                conceptSuffix = ` (Beca: ${name})`;
                
                if (type === 'percentage') {
                    enrollmentDiscount = enrollmentPrice * (value / 100);
                    installmentDiscount = installmentPrice * (value / 100);
                } else if (type === 'fixed_amount') {
                    enrollmentDiscount = Math.min(enrollmentPrice, value);
                    installmentDiscount = Math.min(installmentPrice, value);
                }
            }

            // Item 1: Inscripción (si > 0)
            if (enrollmentPrice > 0) {
                itemsToCreate.push({
                    type: InvoiceItemType.CUSTOM,
                    courseBranchId: courseBranch.id,
                    concept: `Inscripción - ${courseBranch.name}${conceptSuffix}`,
                    quantity: 1,
                    unitPrice: enrollmentPrice,
                    discount: enrollmentDiscount,
                    subtotal: enrollmentPrice - enrollmentDiscount,
                    itbis: 0,
                });
            }

            // Item 2: Cuotas/Monto
            if (installmentPrice > 0) {
                const qty = courseBranch.installments || 1;
                itemsToCreate.push({
                    type: InvoiceItemType.CUSTOM,
                    courseBranchId: courseBranch.id,
                    concept: `Cuotas (${qty}) - ${courseBranch.name}${conceptSuffix}`,
                    quantity: qty,
                    unitPrice: installmentPrice,
                    discount: installmentDiscount * qty,
                    subtotal: (qty * installmentPrice) - (installmentDiscount * qty),
                    itbis: 0,
                });
            }

            for (const payload of itemsToCreate) {
                await apiRequest.post<any>(`quotations/${quotation.id}/items`, payload);
            }

            openNotification('success', 'Oferta académica agregada');
            setCourseBranch(null);
            fetchQuotationData(quotation.id);
        } catch (e) {
            console.error(e);
            openNotification('error', 'Ocurrió un error al agregar la oferta académica');
        } finally {
            setItemLoading(false);
        }
    };

    const handleDeleteItem = (itemId: string) => {
        confirmDialog({
            title: 'Eliminar item',
            text: '¿Seguro que quieres quitar esto de la cotización?',
            icon: 'warning',
            confirmButtonText: 'Sí, eliminar'
        }, async () => {
            setItemLoading(true);
            try {
                const resp = await apiRequest.remove<any>(`quotations/${quotation.id}/items/${itemId}`);
                if (resp.success) {
                    openNotification('success', 'Item eliminado');
                    fetchQuotationData(quotation.id);
                } else {
                    openNotification('error', resp.message);
                }
            } finally {
                setItemLoading(false);
            }
        });
    };

    const onQuoteConceptBlur = async () => {
        if (quotationConcept === (quotation?.concept || '')) return;
        try {
            const resp = await apiRequest.put<any>(`quotations/${quotation.id}`, { concept: quotationConcept });
            if (resp.success) {
                openNotification('success', 'Concepto de cotización actualizado');
                fetchQuotationData(quotation.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const total = quotation?.items?.reduce((acc: number, item: any) => acc + item.subtotal + item.itbis, 0) || 0;

    return (
        <div className="panel p-4">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="col-span-12 md:col-span-8">
                    {/* Concepto General */}
                    <div className="mt-4">
                        <label className="text-sm font-semibold mb-1 block">Referencia / Concepto General</label>
                        <Input
                            placeholder="Ej: Cotización para evento corporativo, Proyecto X, etc."
                            value={quotationConcept}
                            onChange={(e) => setQuotationConcept(e.target.value)}
                            onBlur={onQuoteConceptBlur}
                        />
                    </div>

                    {/* Estudiante */}
                    <div className="mt-4">
                        <label className="text-sm font-semibold mb-1 block">Estudiante (Opcional)</label>
                        <SelectStudent
                            value={student ?? undefined}
                            onChange={onChangeStudent}
                        />
                        {activeStudent?.scholarships?.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 block mb-1">Becas Disponibles:</span>
                                <div className="flex flex-wrap gap-2">
                                    {activeStudent.scholarships.map((s: any) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedScholarship(s)}
                                            className={`text-xs px-2 py-1 rounded border ${selectedScholarship?.id === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}
                                        >
                                            {s.scholarship.name} ({s.scholarship.type === 'percentage' ? `${s.scholarship.value}%` : `$${s.scholarship.value}`})
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setSelectedScholarship(null)}
                                        className={`text-xs px-2 py-1 rounded border ${!selectedScholarship ? 'bg-gray-600 text-white border-gray-600' : 'bg-white dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700'}`}
                                    >
                                        Sin Beca
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Oferta Académica */}
                    <div className="mt-6 border p-4 rounded bg-gray-50 dark:bg-gray-800">
                        <label className="text-sm font-semibold mb-2 block">Agregar Oferta Académica</label>
                        <div className="flex flex-col items-stretch gap-4 md:flex-row">
                            <div className="w-full md:w-[calc(100%-120px)]">
                                <SelectCourseBranch
                                    value={courseBranch?.id || ''}
                                    onlyEnrollable={true}
                                    onChange={(selected: any) => {
                                        if (!selected) setCourseBranch(null);
                                        else {
                                            const cb = selected.courseBranch;
                                            setCourseBranch({
                                                id: cb.id,
                                                name: cb.course.name,
                                                enrollment: cb.enrollmentAmount || 0,
                                                amount: cb.amount || 0,
                                                installments: (cb as any).paymentPlan?.installments || 1
                                            });
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                className="w-full md:w-[120px]"
                                color="primary"
                                disabled={itemLoading || !courseBranch}
                                onClick={handleAddCourseBranch}
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>

                    {/* Productos */}
                    <div className="mt-6 border p-4 rounded bg-gray-50 dark:bg-gray-800">
                        <label className="text-sm font-semibold mb-2 block">Agregar Producto</label>
                        <div className="flex flex-col items-stretch gap-4 md:flex-row">
                            <div className="w-full md:w-[calc(100%-250px)]">
                                <SelectProduct
                                    ref={productRef}
                                    value={productItem?.productId || ''}
                                    onChange={(sel: ProductSelect | null) => {
                                        if (!sel) setProductItem(null);
                                        else {
                                            setProductItem({ productId: sel.value, unitPrice: sel.price, quantity: 1, name: sel.name });
                                            if (quantityRef.current) quantityRef.current.focus();
                                        }
                                    }}
                                />
                            </div>
                            <div className="w-full md:w-[120px]">
                                <Input
                                    ref={quantityRef}
                                    placeholder="Cant."
                                    type="number"
                                    min="1"
                                    value={productItem ? productItem.quantity : ''}
                                    onChange={(e) => {
                                        if (!productItem) return;
                                        setProductItem({ ...productItem, quantity: Number(e.target.value) });
                                    }}
                                />
                            </div>
                            <Button
                                className="w-full md:w-[110px]"
                                color="primary"
                                disabled={itemLoading || !productItem}
                                onClick={handleAddProduct}
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>

                    {/* Tabla de elements */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-sm dark:bg-gray-700">
                                    <th className="px-2 py-2 text-left">DESCRIPCIÓN</th>
                                    <th className="px-2 py-2 text-left">CANTIDAD</th>
                                    <th className="px-2 py-2 text-left">PRECIO</th>
                                    <th className="px-2 py-2 text-left">DESC.</th>
                                    <th className="px-2 py-2 text-left">SUBTOTAL</th>
                                    <th className="px-2 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotation?.items?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-4 text-center italic text-gray-500 dark:text-gray-400">
                                            No se han agregado items a esta cotización.
                                        </td>
                                    </tr>
                                )}
                                {quotation?.items?.map((item: any) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="px-2 py-2">
                                            {item.productId ? (
                                                <ProductLabel ProductId={item.productId} />
                                            ) : (
                                                <span className="text-gray-800 dark:text-gray-200">
                                                    {item.concept || 'Oferta Académica'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2">{item.quantity}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.unitPrice || 0)}</td>
                                        <td className="px-2 py-2 text-red-500">{item.discount > 0 ? `-${formatCurrency(item.discount)}` : '-'}</td>
                                        <td className="px-2 py-2 font-semibold text-primary">{formatCurrency(item.subtotal)}</td>
                                        <td className="px-2 py-2">
                                            <Button
                                                variant="outline"
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <TbX className="size-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Resumen Sidebar */}
                <div className="col-span-12 md:col-span-4 mt-4 md:mt-0 p-4 bg-white dark:bg-gray-800 shadow rounded border dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <HiOutlineDocumentText className="text-primary size-6" />
                        Detalle de Cotización
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Número:</span>
                            <span className="font-semibold">{quotation?.quotationNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fecha:</span>
                            <span className="font-semibold">{new Date(quotation?.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estado:</span>
                            <span className="font-semibold">{quotation?.status}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold items-center">
                            <span>Total Estimado:</span>
                            <span className="text-primary text-xl">{formatCurrency(total)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 leading-tight">
                            Esta cotización es solo informativa y sus precios están sujetos a cambios. No representa una factura ni un comprobante de pago.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Button
                            color="success"
                            className="w-full"
                            disabled={!quotation?.items?.length}
                            icon={<TbPrinter className="mr-2 size-5" />}
                            onClick={() => setOpenPrintModal(true)}
                        >
                            Imprimir Cotización
                        </Button>
                        <Button
                            variant="outline"
                            color="dark"
                            className="w-full"
                            onClick={() => router.push('/quotations')}
                        >
                            Volver al Listado
                        </Button>
                    </div>
                </div>
            </div>

            {openPrintModal && (
                <QuotationPDFModal
                    quotation={quotation}
                    openModal={openPrintModal}
                    setOpenModal={setOpenPrintModal}
                />
            )}
        </div>
    );
}
