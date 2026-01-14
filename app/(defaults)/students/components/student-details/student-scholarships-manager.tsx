import { useState, useEffect } from 'react';
import Drawer from '@/components/ui/drawer';
import { Button } from '@/components/ui';
import Select from '@/components/ui/select';
import { IconTrashLines, IconPlus, IconX } from '@/components/icon';
import useFetchStudentScholarships from '../../lib/use-fetch-student-scholarships';
import { assignScholarship, removeStudentScholarship, getScholarships } from '../../lib/student-scholarship-request';
import { openNotification, confirmDialog } from '@/utils';
import Skeleton from '@/components/common/Skeleton';
import SelectScholarship from '@/components/common/selects/select-scholarship';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import Input from '@/components/ui/input';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Checkbox from '@/components/ui/checkbox';
import { useSession } from 'next-auth/react';

interface Props {
    studentId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentScholarshipsManager({ studentId, isOpen, onClose }: Props) {
    const { loading, scholarships, refresh } = useFetchStudentScholarships(studentId);
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id;

    const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
    const [selectedCourseBranch, setSelectedCourseBranch] = useState<any>(null);
    const [validUntil, setValidUntil] = useState<Date | null>(null);
    const [reason, setReason] = useState('');
    const [active, setActive] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            refresh();
            setShowForm(false); // Reset form visibility when drawer opens
        }
    }, [isOpen, refresh]);

    const handleAssign = async () => {
        if (!selectedScholarship || !userId) {
            if (!userId) {
                openNotification('error', 'No se pudo obtener el usuario autenticado');
            }
            return;
        }
        setAssigning(true);
        try {
            const payload = {
                scholarshipId: selectedScholarship.value,
                courseBranchId: selectedCourseBranch?.value || null,
                validUntil: validUntil ? validUntil.toISOString() : null,
                reason: reason || null,
                active: active,
                assignedBy: userId // Use authenticated user ID
            };

            const resp = await assignScholarship(studentId, payload as any);

            if (resp.success) {
                openNotification('success', 'Beca asignada correctamente');
                refresh();
                // Reset form
                setSelectedScholarship(null);
                setSelectedCourseBranch(null);
                setValidUntil(null);
                setReason('');
                setActive(true);
                setShowForm(false); // Hide form after successful assignment
            } else {
                openNotification('error', resp.message);
            }
        } catch (e) {
            openNotification('error', 'Error al asignar beca');
        } finally {
            setAssigning(false);
        }
    };

    const handleDelete = async (id: string) => {
        confirmDialog({
            title: 'Eliminar Beca',
            text: '¿Seguro que quieres eliminar esta asignación?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'warning'
        }, async () => {
            const resp = await removeStudentScholarship(studentId, id);
            if (resp.success) {
                openNotification('success', 'Beca eliminada correctamente');
                refresh();
            } else {
                openNotification('error', resp.message);
            }
        });
    };

    return (
        <Drawer open={isOpen} onClose={onClose} title="Gestionar Becas" className="max-w-md">
            <div className="flex flex-col gap-6 p-4 h-full">
                {/* Add Form Toggle */}
                {!showForm ? (
                    <Button
                        onClick={() => setShowForm(true)}
                        icon={<IconPlus className="w-4 h-4" />}
                        className="w-full"
                    >
                        Asignar Nueva Beca
                    </Button>
                ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-sm uppercase text-gray-500">Asignar Nueva Beca</h5>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <SelectScholarship
                                value={selectedScholarship?.value}
                                onChange={setSelectedScholarship}
                                placeholder="Seleccionar beca..."
                            />

                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Oferta Académica (Opcional)</label>
                                    <SelectCourseBranch
                                        value={selectedCourseBranch?.value}
                                        onChange={setSelectedCourseBranch}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Válida Hasta</label>
                                    <Flatpickr
                                        value={validUntil ? [validUntil] : []}
                                        options={{
                                            dateFormat: 'd/m/Y',
                                            locale: Spanish,
                                        }}
                                        className="form-input w-full"
                                        onChange={(dates) => setValidUntil(dates[0] || null)}
                                        placeholder="Seleccionar fecha..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Motivo</label>
                                    <Input
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Razón de otorgamiento..."
                                    />
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <Checkbox
                                        checked={active}
                                        onChange={(checked) => setActive(checked)}
                                    >
                                        Activa
                                    </Checkbox>
                                </div>
                            </div>

                            <Button
                                onClick={handleAssign}
                                disabled={assigning || !selectedScholarship}
                                className="w-full mt-2"
                            >
                                {assigning ? 'Asignando...' : 'Asignar'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    <h5 className="font-semibold mb-3 text-sm uppercase text-gray-500">Becas Asignadas</h5>
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton rows={3} />
                        </div>
                    ) : scholarships.length === 0 ? (
                        <p className="text-gray-500 text-center italic mt-10">No tiene becas asignadas.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {scholarships.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded shadow-sm hover:shadow-md transition-shadow">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white-light">{item.scholarship?.name || 'Beca'}</p>
                                    </div>
                                    <Button
                                        icon={<IconTrashLines className="w-4 h-4" />}
                                        color="danger"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 border-none hover:bg-red-50 dark:hover:bg-red-900/20"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
}
