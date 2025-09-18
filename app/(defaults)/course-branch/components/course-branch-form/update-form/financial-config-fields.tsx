import { useEffect, useState } from "react";
import { Field, FieldProps, FormikErrors, FormikTouched } from "formik";
import { CourseBranchFormType } from "../form.config";
import { Button, FormItem, Input } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import { createPaymentPlan, getPaymentPlan } from "../../../lib/request";
import { useParams } from "next/navigation";
import { PaymentPlanForm, PaymentPlanModal } from "./PaymentPlanModal";
import { openNotification } from "@/utils";


interface FinancialConfigFieldsProps {
    values: CourseBranchFormType;
    errors: FormikErrors<CourseBranchFormType>;
    touched: FormikTouched<CourseBranchFormType>;
    className?: string;
}

type PaymentPlan = {
    frequency: "WEEKLY" | "MONTHLY";
    installments: number;
    dayOfMonth: number;
    dayOfWeek: number;
    graceDays: number;
    lateFeeAmount: number;
};

export default function FinancialConfigFields({ values, errors, touched, className }: FinancialConfigFieldsProps) {
    const { id } = useParams();
    const courseBranchId = id as string;

    const [paymentPlan, setPaymentPlan] = useState<PaymentPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await getPaymentPlan(courseBranchId);
                if (res.success) {
                    setPaymentPlan(res.data as PaymentPlan);
                }
            } catch (err) {
                console.error("Error cargando paymentPlan", err);
            }
        };
        if (courseBranchId) {
            fetchPlan();
        }
    }, [courseBranchId]);

    const handleSavePaymentPlan = async (plan: PaymentPlanForm) => {
        setLoading(true)

        try {
            const resp = await createPaymentPlan(courseBranchId, plan);

            if (resp.success) {
                setPaymentPlan(resp.data as PaymentPlan);
            } else {
                openNotification('error', 'Se Produjo un erro al guardar el metodo de pagp');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
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

            {/* ================== Frecuencia de pago ================== */}
            <FormItem label="Frecuencia de pago">
                <Field as="div" className="flex gap-2 items-center">
                    {!paymentPlan ? (
                        <Button onClick={() => setIsModalOpen(true)}>
                            Agregar configuración
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant={paymentPlan.frequency === "WEEKLY" ? "default" : "outline"}
                                className="ltr:rounded-r-none rtl:rounded-l-none"
                            >
                                Semanal
                            </Button>
                            <Button
                                type="button"
                                variant={paymentPlan.frequency === "MONTHLY" ? "default" : "outline"}
                                className="ltr:rounded-l-none rtl:rounded-r-none"
                            >
                                Mensual
                            </Button>
                        </>
                    )}
                </Field>
            </FormItem>

            {/* ================== PaymentPlanModal ================== */}
            <PaymentPlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePaymentPlan}
                scheduleDays={[0, 1, 2, 3, 4, 5, 6]}
                sessionCount={values.sessionCount}
                loading={loading}
            />
        </div>
    );
}
