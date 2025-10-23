import { useState, useEffect, useRef } from "react";
import { Button, FormItem, Input, Select } from "@/components/ui";

export type PaymentPlanForm = {
    dayOfWeek: number | null;
    frequency: "ONCE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "PER_CLASS" | "CUSTOM";
    installments: number;
    dayOfMonth: number | null;
    graceDays: number;
    lateFeeAmount: number;
    sessionCount?: number;
    courseBranchId?: string;
};

type PaymentPlanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (data: PaymentPlanForm) => void;
    scheduleDays: number[];
    sessionCount?: number;
    loading?: boolean;
    initialData?: PaymentPlanForm | null;
};

export function PaymentPlanModal({
    isOpen,
    onClose,
    onEdit,
    scheduleDays,
    sessionCount,
    loading,
    initialData,
}: PaymentPlanModalProps) {
    const [formData, setFormData] = useState<PaymentPlanForm>({
        frequency: "WEEKLY",
        dayOfWeek: scheduleDays[0] ?? 0,
        installments: sessionCount ?? 0,
        dayOfMonth: null,
        graceDays: 0,
        lateFeeAmount: 0,
    });

    const initializedRef = useRef(false);

    useEffect(() => {
        if (initialData && !initializedRef.current) {
            setFormData({
                ...initialData,
                sessionCount: initialData.sessionCount ?? sessionCount ?? 0,
            });
            initializedRef.current = true;
        }
    }, [initialData]);

    const handleChange = (field: keyof PaymentPlanForm, value: any) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };

            if (field === "frequency") {
                if (value === "WEEKLY") {
                    newData.dayOfMonth = null;
                    newData.dayOfWeek = scheduleDays.includes(prev.dayOfWeek ?? 0)
                        ? prev.dayOfWeek
                        : scheduleDays[0] ?? 0;
                } else if (value === "MONTHLY") {
                    newData.dayOfWeek = null;
                    newData.dayOfMonth = prev.dayOfMonth ?? 1;
                }
            }

            return newData;
        });
    };

    const handleSubmit = () => {
        onEdit(formData);
       
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Editar Plan de Pago</h2>

                {/* Frecuencia de cobro */}
                <FormItem label="Frecuencia de cobro">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { value: "WEEKLY", label: "Semanal" },
                            { value: "MONTHLY", label: "Mensual" },
                        ].map((freq) => (
                            <Button
                                key={freq.value}
                                type="button"
                                variant={formData.frequency === freq.value ? "default" : "outline"}
                                onClick={() => handleChange("frequency", freq.value)}
                            >
                                {freq.label}
                            </Button>
                        ))}
                    </div>
                </FormItem>

                {/* Días de pago (solo si es semanal) */}
                {formData.frequency === "WEEKLY" && (
                    <FormItem label="Día de pago">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {Array.from({ length: 7 }, (_, day) => (
                                <Button
                                    key={day}
                                    type="button"
                                    variant={formData.dayOfWeek === day ? "default" : "outline"}
                                    onClick={() => handleChange("dayOfWeek", day)}
                                >
                                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][day]}
                                </Button>
                            ))}
                        </div>
                    </FormItem>
                )}

                {/* Día del mes (solo si es mensual) */}
                {formData.frequency === "MONTHLY" && (
                    <FormItem label="Día del mes">
                        <Select
                            options={Array.from({ length: 31 }, (_, i) => ({
                                value: i + 1,
                                label: `${i + 1}`,
                            }))}
                            value={
                                formData.dayOfMonth
                                    ? { value: formData.dayOfMonth, label: `${formData.dayOfMonth}` }
                                    : null
                            }
                            onChange={(option) => {
                                const opt = option as { value: number; label: string } | null;
                                if (opt) handleChange("dayOfMonth", opt.value);
                            }}
                            placeholder="Selecciona el día del mes"
                        />
                    </FormItem>
                )}

                {/* Otros inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormItem label="Cantidad de cuotas">
                        <Input
                            type="number"
                            value={formData.installments}
                            onChange={(e) =>
                                handleChange("installments", Number(e.target.value) || 0)
                            }
                            placeholder="Cantidad de cuotas"
                        />
                    </FormItem>
                    <FormItem label="Días de gracia">
                        <Input
                            type="number"
                            value={formData.graceDays}
                            onChange={(e) =>
                                handleChange("graceDays", Number(e.target.value) || 0)
                            }
                            placeholder="Días de gracia"
                        />
                    </FormItem>
                    <FormItem label="Monto de recargo">
                        <Input
                            type="number"
                            value={formData.lateFeeAmount}
                            onChange={(e) =>
                                handleChange("lateFeeAmount", Number(e.target.value) || 0)
                            }
                            placeholder="Monto de recargo"
                        />
                    </FormItem>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} loading={loading}>
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    );
}
