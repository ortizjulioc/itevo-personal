'use client';
import { Button } from "@/components/ui";
import CreateScheduleForm from "./create-schedule";
import { TbPlus, TbX } from "react-icons/tb";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SchedulesFormProps {
    isFormVisible: boolean;
    className?: string;
    onCreated?: (schedule: any) => void;
}

export default function SchedulesForm({
    onCreated,
    isFormVisible,
    className
}: SchedulesFormProps) {

    return (
        <div className={`space-y-4 ${className}`}>
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
                            <CreateScheduleForm onCreated={onCreated} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
