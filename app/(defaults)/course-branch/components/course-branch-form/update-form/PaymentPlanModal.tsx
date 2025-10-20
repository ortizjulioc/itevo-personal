import { useState } from "react";
import { Button, FormItem, Input, Select } from "@/components/ui";

export type PaymentPlanForm = {
    dayOfWeek: number;
    frequency: "ONCE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "PER_CLASS" | "CUSTOM";
    installments: number;
    dayOfMonth: number;
    graceDays: number;
    lateFeeAmount: number;
    sessionCount?: number;
};

type PaymentPlanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PaymentPlanForm) => void;
    onEdit?: (data: PaymentPlanForm) => void; // Added optional onEdit prop
    scheduleDays: number[];
    sessionCount?: number;
    loading?: boolean;
    initialData?: PaymentPlanForm | null;
};

export function PaymentPlanModal({ isOpen, onClose, onSave, onEdit, scheduleDays, sessionCount, loading, initialData }: PaymentPlanModalProps) {
    const [formData, setFormData] = useState<PaymentPlanForm>(
        initialData || {
            frequency: "WEEKLY",
            dayOfWeek: 0,
            installments: sessionCount || 0,
            dayOfMonth: 1,
            graceDays: 0,
            lateFeeAmount: 0,
        }
    );

    const handleChange = (field: keyof PaymentPlanForm, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (initialData && onEdit) {
            onEdit(formData); // Call onEdit if initialData exists and onEdit is provided
        } else {
            onSave(formData); // Call onSave for new payment plans
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Editar Plan de Pago" : "Configurar Plan de Pago"}</h2>

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
                                onClick={() => {
                                    handleChange("frequency", freq.value as PaymentPlanForm["frequency"]);
                                    if (freq.value === "WEEKLY") {
                                        handleChange("dayOfMonth", 0);
                                    } else if (freq.value === "MONTHLY") {
                                        handleChange("dayOfWeek", 0);
                                    }
                                }}
                            >
                                {freq.label}
                            </Button>
                        ))}
                    </div>
                </FormItem>
                {formData.frequency === "WEEKLY" && (
                    <FormItem label="Día de pago">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {scheduleDays.map((day) => (
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

                {formData.frequency === "MONTHLY" && (
                    <FormItem label="Día del mes">
                        <Select
                            options={Array.from({ length: 31 }, (_, i) => ({
                                value: i + 1,
                                label: `${i + 1}`,
                            }))}
                            value={{ value: formData.dayOfMonth, label: `${formData.dayOfMonth}` }}
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
                            onChange={(e) => handleChange("installments", Number(e.target.value))}
                            placeholder="Cantidad de cuotas"
                        />
                    </FormItem>

                    <FormItem label="Días de gracia">
                        <Input
                            type="number"
                            value={formData.graceDays}
                            onChange={(e) => handleChange("graceDays", Number(e.target.value))}
                            placeholder="Días de gracia"
                        />
                    </FormItem>

                    <FormItem label="Monto de recargo">
                        <Input
                            type="number"
                            value={formData.lateFeeAmount}
                            onChange={(e) => handleChange("lateFeeAmount", Number(e.target.value))}
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