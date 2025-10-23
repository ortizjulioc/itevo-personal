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
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    let fetched = false;

    const fetchPlan = async () => {
        if (fetched) return;
        fetched = true;

        try {
            const res = await getPaymentPlan(courseBranchId);
            if (res.success) {
                setPaymentPlan(res.data as PaymentPlan);
            } else {
                // Solo crear plan por defecto una vez
                const defaultPlan: PaymentPlanForm = {
                    frequency: "WEEKLY",
                    dayOfWeek: scheduleDays[0] || 0,
                    installments: values.sessionCount || 0,
                    dayOfMonth: 1,
                    graceDays: 0,
                    lateFeeAmount: 0,
                };
                const resp = await createPaymentPlan(courseBranchId, defaultPlan);
                if (resp.success) {
                    setPaymentPlan(resp.data as PaymentPlan);
                    openNotification("success", "Plan de pago por defecto creado con éxito");
                } else {
                    openNotification("error", "Error al crear el plan de pago por defecto");
                }
            }
        } catch (err) {
            console.error("Error cargando paymentPlan", err);
            openNotification("error", "Error al cargar el plan de pago");
        } finally {
            setLoading(false);
        }
    };

    // Solo ejecutamos una vez cuando tengamos courseBranchId y scheduleDays cargado
    if (courseBranchId && scheduleDays.length > 0 && !paymentPlan) {
        fetchPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [courseBranchId, scheduleDays.length]);

    const handleSavePaymentPlan = async (plan: PaymentPlanForm) => {
        setLoading(true);
        try {
            const resp = await createPaymentPlan(courseBranchId, plan);
            if (resp.success) {
                setPaymentPlan(resp.data as PaymentPlan);
                openNotification('success', 'Plan de pago guardado con éxito');
            } else {
                openNotification('error', 'Se produjo un error al guardar el plan de pago');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error guardando paymentPlan", error);
            openNotification('error', 'Se produjo un error al guardar el plan de pago');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPaymentPlan = async (plan: PaymentPlanForm) => {
        setLoading(true);
        try {
            const paymentPlanid = paymentPlan?.id;
            if (!paymentPlanid) {
                openNotification('error', 'No se encontró el ID del plan de pago');
                return;
            }
            
            const resp = await updatePaymentPlan(courseBranchId, plan, paymentPlanid);
            if (resp.success) {
                setPaymentPlan(resp.data as PaymentPlan);
                openNotification('success', 'Plan de pago actualizado con éxito');
            } else {
                openNotification('error', 'Se produjo un error al actualizar el plan de pago');
            }
            
        } catch (error) {
            console.error("Error actualizando paymentPlan", error);
            openNotification('error', 'Se produjo un error al actualizar el plan de pago');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
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
                <span>Cargando configuración financiera...</span>
            )}
            {!loading && paymentPlan && (
                <FormItem label="Configuración financiera">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-gray-600">Frecuencia de pago:</p>
                            <p className="text-gray-800">
                                {paymentPlan.frequency === "WEEKLY" ? "Semanal" : "Mensual"}
                                {paymentPlan.frequency === "WEEKLY" && paymentPlan.dayOfWeek !== null
                                    ? ` (${weekdayNames[paymentPlan.dayOfWeek]})`
                                    : paymentPlan.frequency === "MONTHLY" && paymentPlan.dayOfMonth
                                    ? ` (Día ${paymentPlan.dayOfMonth})`
                                    : ""}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Cuotas:</p>
                            <p className="text-gray-800">{paymentPlan.installments}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Días de gracia:</p>
                            <p className="text-gray-800">{paymentPlan.graceDays}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-600">Monto de recargo:</p>
                            <p className="text-gray-800">RD${paymentPlan.lateFeeAmount}</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={handleOpenModal}
                    >
                        Editar
                    </Button>
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
