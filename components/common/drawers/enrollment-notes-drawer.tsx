'use client';

import { useState, useEffect } from 'react';
import Drawer from '@/components/ui/drawer';
import { Button } from '@/components/ui';
import { openNotification } from '@/utils';
import { updateEnrollment } from '@/app/(defaults)/enrollments/lib/request';
import Input from '@/components/ui/input';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    enrollment: any | null; // El objeto completo de inscripción
    onSuccess?: (notes: string) => void;
}

export default function EnrollmentNotesDrawer({ isOpen, onClose, enrollment, onSuccess }: Props) {
    const [notes, setNotes] = useState<string>(enrollment?.notes || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setNotes(enrollment?.notes || '');
    }, [enrollment, isOpen]);

    const handleSave = async () => {
        if (!enrollment) return;
        setSaving(true);
        try {
            const resp = await updateEnrollment(enrollment.id, {
                ...enrollment,
                notes,
            });

            if (resp.success) {
                openNotification('success', 'Notas guardadas correctamente');
                if (onSuccess) {
                    onSuccess(notes);
                }
                onClose();
            } else {
                openNotification('error', resp.message || 'Error al guardar las notas');
            }
        } catch (error) {
            openNotification('error', 'Error al guardar las notas');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setNotes(enrollment?.notes || '');
        onClose();
    };

    return (
        <Drawer open={isOpen} onClose={handleClose} title="Notas de Inscripción" className="max-w-md">
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <label className="mb-2 block text-sm text-gray-500 dark:text-gray-400">Agrega una aclaración o nota importante sobre esta inscripción</label>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Escribe las notas aquí..." className="min-h-[150px]" textArea />
                </div>

                <div className="mt-4 flex gap-2">
                    <Button type="button" color="danger" onClick={handleClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} loading={saving} className="flex-1">
                        {saving ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
