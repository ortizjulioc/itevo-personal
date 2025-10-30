import { useEffect, useState } from "react";
import { Field, FieldProps, FormikErrors, FormikTouched } from "formik";
import { CourseBranchFormType } from "../form.config";
import { Button, FormItem, Input } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import { createPaymentPlan, getPaymentPlan, updatePaymentPlan } from "../../../lib/request";
import { useParams } from "next/navigation";
import { PaymentPlanForm, PaymentPlanModal } from "./PaymentPlanModal";
import { openNotification } from "@/utils";
import { useFetchScheduleByCourseId } from "@/app/(defaults)/schedules/lib/use-fetch-schedules";

interface FinancialConfigFieldsProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    className?: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

type PaymentPlan = {
    id: string;
    frequency: "WEEKLY" | "MONTHLY";
    installments: number;
    dayOfMonth: number;
    dayOfWeek: number;
    graceDays: number;
    lateFeeAmount: number;
    courseBranchId?: string;
};

const weekdayNames = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

export default function FinancialConfigFields({ values, errors, touched, className, setFieldValue }: FinancialConfigFieldsProps) {
    const { id } = useParams();
    const courseBranchId = id as string;
    const { schedules } = useFetchScheduleByCourseId(courseBranchId);
    const scheduleDays = schedules?.map(schedule => schedule.weekday) || [];

    const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!courseBranchId) return;

        const fetchPlan = async () => {
            setLoading(true);
            try {
                const res = await getPaymentPlan(courseBranchId);
                if (res.success && res.data) {
                    setPaymentPlan(res.data as PaymentPlan);
                } else {
                    setPaymentPlan(null);
                }
            } catch (err) {
                console.error("Error cargando paymentPlan", err);
                openNotification("error", "Error al cargar el plan de pago");
                setPaymentPlan(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [courseBranchId]);

    const handleEditPaymentPlan = async (plan: PaymentPlanForm) => {
        setLoading(true);
        try {
            const { courseBranchId: _, sessionCount: __, ...cleanPlan } = plan;
            let resp;
            let successMessage = "Plan de pago creado con éxito";

            if (paymentPlan?.id) {
                resp = await updatePaymentPlan(courseBranchId, cleanPlan, paymentPlan.id);
                successMessage = "Plan de pago actualizado con éxito";
            } else {
                resp = await createPaymentPlan(courseBranchId, cleanPlan);
            }

            if (resp.success) {
                setPaymentPlan(resp.data as PaymentPlan);
                openNotification('success', successMessage);
                setIsModalOpen(false);
            } else {
                openNotification('error', 'Se produjo un error al guardar el plan de pago');
            }
        } catch (error) {
            console.error("Error guardando paymentPlan", error);
            openNotification('error', 'Se produjo un error al guardar el plan de pago');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={className}>
            {/* ================== Monto de la cuota ================== */}
            <FormItem
                extra={
                    <Tooltip title={"Este es el costo que tendrá cada cuota del curso.\nEste monto será cobrado en cada clase."}>
                        <span className="text-gray-600 bg-gray-200 rounded-full px-1 text-xs">?</span>
                    </Tooltip>
                }
                name="amount"
                label="Monto de la cuota"
                invalid={Boolean(errors.amount && touched.amount)}
                errorMessage={errors.amount}
            >
                <Field name="amount">
                    {({ field }: any) => (
                        <div className="flex">
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                RD$
                            </div>
                            <Input
                                {...field}
                                value={values.amount || ""}
                                type="number"
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                placeholder="Ingrese el monto de cada cuota"
                                className="form-input rounded-none"
                            />
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                .00
                            </div>
                        </div>
                    )}
                </Field>
            </FormItem>

            {/* ================== Monto de comisión ================== */}
            <FormItem
                extra={
                    <Tooltip title="Este es el monto que recibirá el profesor por cada clase">
                        <span className="text-gray-600 bg-gray-200 rounded-full px-1 text-xs">?</span>
                    </Tooltip>
                }
                name="commissionAmount"
                label="Monto de comisión al profesor"
            >
                <Field name="commissionAmount">
                    {({ field, form }: FieldProps<CourseBranchFormType>) => {
                        const rawAmount = Number(form.values.amount) || 0;

                        return (
                            <div className="flex">
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    RD$
                                </div>
                                <Input
                                    {...field}
                                    value={form.values.commissionAmount ?? ""}
                                    onChange={(e) => {
                                        const input = Number(e.target.value);
                                        form.setFieldValue("commissionAmount", input);
                                        const newRate = rawAmount !== 0 ? input / rawAmount : 0;
                                        form.setFieldValue("commissionRate", newRate);
                                    }}
                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    type="number"
                                    placeholder="Monto que ganará el profesor"
                                    className="form-input rounded-none"
                                />
                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                    .00
                                </div>
                            </div>
                        );
                    }}
                </Field>
            </FormItem>

            {/* ================== Monto de inscripción ================== */}
            <FormItem
                extra={
                    <Tooltip title={"Este es el costo que tendrá la inscripción del curso.\nEste monto será cobrado una sola vez al momento de inscribir al estudiante."}>
                        <span className="text-gray-600 bg-gray-200 rounded-full px-1 text-xs">?</span>
                    </Tooltip>
                }
                name="enrollmentAmount"
                label="Monto de inscripción"
                invalid={Boolean(errors.enrollmentAmount && touched.enrollmentAmount)}
                errorMessage={errors.enrollmentAmount}
            >
                <Field name="enrollmentAmount">
                    {({ field }: any) => (
                        <div className="flex">
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                RD$
                            </div>
                            <Input
                                {...field}
                                value={values.enrollmentAmount || ""}
                                type="number"
                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                placeholder="Ingrese el monto de inscripción"
                                className="form-input rounded-none"
                            />
                            <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                                .00
                            </div>
                        </div>
                    )}
                </Field>
            </FormItem>

            {/* ================== Configuración financiera ================== */}
            {loading && (
                <span>Cargando plan de pago...</span>
            )}
            {!loading && !paymentPlan && (
                <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white lg:w-1/2">
                    <Button
                        type="button"
                        onClick={handleOpenModal}
                        className="w-full"
                    >
                        Configurar plan de pago
                    </Button>
                </div>
            )}
            {!loading && paymentPlan && (
                <FormItem label="Plan de pago" name="paymentPlan">
                    {/* Contenedor principal con estilo de "tarjeta" (Card) */}
                    <div className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white lg:w-1/2">

                        {/* Encabezado y Botón de Edición en la misma línea */}
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                {/* Ícono más pequeño, color gris oscuro */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Detalles del Plan
                            </h3>
                            {/* Botón de Edición */}
                            <Button
                                type="button"
                                variant="outline" // Mantenemos outline o ghost
                                size="sm" // Reducido el tamaño
                                onClick={handleOpenModal}
                                className="text-xs" // Tipografía más pequeña
                            >
                                Editar
                            </Button>
                        </div>

                        {/* Sección principal (Frecuencia y Cuotas) - Ahora con 'text-xl' (antes 'text-2xl') y color gris oscuro */}
                        <div className="grid grid-cols-2 gap-5 border-b pb-3 mb-3">

                            {/* Frecuencia de Pago */}
                            <div>
                                <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-0.5">Frecuencia de pago</p>
                                <p className="text-xl font-bold text-gray-800">
                                    {paymentPlan.frequency === "WEEKLY" ? "Semanal" : "Mensual"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {paymentPlan.frequency === "WEEKLY" && paymentPlan.dayOfWeek !== null
                                        ? `(Día: ${weekdayNames[paymentPlan.dayOfWeek]})`
                                        : paymentPlan.frequency === "MONTHLY" && paymentPlan.dayOfMonth
                                            ? `(Día ${paymentPlan.dayOfMonth} de cada mes)`
                                            : ""}
                                </p>
                            </div>

                            {/* Cuotas */}
                            <div>
                                <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-0.5">Cuotas totales</p>
                                <p className="text-xl font-extrabold text-gray-800">
                                    {paymentPlan.installments}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {paymentPlan.installments === 1 ? 'Cuota' : 'Cuotas'}
                                </p>
                            </div>

                        </div>

                        {/* Sección de Recargos/Gracia - Información secundaria */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-600 mt-3 ">Política de Morosidad</h4>
                            <div className="grid grid-cols-2 gap-4">

                                {/* Días de Gracia */}
                                <div>
                                    <p className="font-medium text-xs text-gray-500">Días de gracia:</p>
                                    <p className="text-sm font-bold text-gray-800">{paymentPlan.graceDays} días</p>
                                </div>

                                {/* Monto de Recargo */}
                                <div>
                                    <p className="font-medium text-xs text-gray-500">Monto de recargo (mora):</p>
                                    <p className="text-sm font-bold text-gray-800">RD${paymentPlan.lateFeeAmount}</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </FormItem>
            )}

            {/* ================== PaymentPlanModal ================== */}
            <PaymentPlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEdit={handleEditPaymentPlan}
                scheduleDays={scheduleDays}
                sessionCount={values.sessionCount}
                loading={loading}
                initialData={paymentPlan ? { ...paymentPlan, sessionCount: values.sessionCount } as PaymentPlanForm : undefined}
            />
        </div>
    );
}
