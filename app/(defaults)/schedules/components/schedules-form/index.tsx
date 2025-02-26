'use client';
import { Button } from "@/components/ui";
import CreateScheduleForm from "./create-schedule";
import { TbPlus, TbX } from "react-icons/tb";
import { useState } from "react";

export default function SchedulesForm({ className }: { className?: string }) {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const toggleForm = () => {
        setIsFormVisible(prev => !prev);
        console.log('New schedule toggled');
    };
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-end">
                {isFormVisible && (
                    <Button
                        color="danger"
                        variant="default"
                        icon={<TbX className="size-4" />}
                        onClick={toggleForm}
                        size="sm"
                        className="transition-all duration-200 hover:shadow-md"
                    >
                        Cerrar
                    </Button>
                )}
                {!isFormVisible && (
                    <Button
                        variant="default"
                        icon={<TbPlus className="size-4" />}
                        onClick={toggleForm}
                        size="sm"
                        className="transition-all duration-200 hover:shadow-md"
                    >
                        Agregar Horario
                    </Button>
                )}
            </div>
            <div
                className={`transition-all duration-300 ease-in-out transform ${
                    isFormVisible
                        ? "translate-y-0 opacity-100 h-auto z-50"
                        : "-translate-y-4 opacity-0 h-0 overflow-hidden z-0"
                }`}
            >
                <div className="pt-2">
                    <CreateScheduleForm />
                </div>
            </div>
        </div>
    );
}
