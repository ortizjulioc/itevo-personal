import { useState } from "react";
import { Button, FormItem, Input } from "@/components/ui";

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
    scheduleDays: number[];
    sessionCount?: number;
    loading?: boolean;
};

export function PaymentPlanModal({ isOpen, onClose, onSave, scheduleDays, sessionCount, loading }: PaymentPlanModalProps) {
    const [formData, setFormData] = useState<PaymentPlanForm>({
        frequency: "WEEKLY",
        dayOfWeek: 0,
        installments: sessionCount || 0,
        dayOfMonth: 1,
        graceDays: 0,
        lateFeeAmount: 0,
    });



    const handleChange = (field: keyof PaymentPlanForm, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        // onClose();
    };

    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Configurar Plan de Pago</h2>

                {/* Frecuencia de cobro */}
                <FormItem label="Frecuencia de cobro">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            //   { value: "ONCE", label: "Una vez" },
                            { value: "WEEKLY", label: "Semanal" },
                            //   { value: "BIWEEKLY", label: "Quincenal" },
                            { value: "MONTHLY", label: "Mensual" },
                            //   { value: "PER_CLASS", label: "Por clase" },
                            //   { value: "CUSTOM", label: "Personalizado" },
                        ].map((freq) => (
                            <Button
                                key={freq.value}
                                type="button"
                                variant={formData.frequency === freq.value ? "default" : "outline"}
                                onClick={() => handleChange("frequency", freq.value as PaymentPlanForm["frequency"])}
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
                        <Input
                            type="number"
                            value={formData.dayOfMonth}
                            onChange={(e) => handleChange("dayOfMonth", Number(e.target.value))}
                            placeholder="Día del mes"
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
                    <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
                </div>
            </div>
        </div>
    );
}
