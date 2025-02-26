'use client';
import { Button } from "@/components/ui";
import CreateScheduleForm from "./create-schedule";
import { TbPlus, TbX } from "react-icons/tb";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
            <AnimatePresence>
                {isFormVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ position: "relative", zIndex: 50 }}
                    >
                        <div className="">
                            <CreateScheduleForm />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
