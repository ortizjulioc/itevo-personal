import { useState } from 'react';
import Drawer from '@/components/ui/drawer';
import { Button } from '@/components/ui';
import { openNotification } from '@/utils';
import SelectScholarship from '@/components/common/selects/select-scholarship';
import SelectCourseBranch from '@/components/common/selects/select-course-branch';
import Input from '@/components/ui/input';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import Checkbox from '@/components/ui/checkbox';
import { useSession } from 'next-auth/react';
import { assignScholarship } from '@/app/(defaults)/students/lib/student-scholarship-request';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    courseBranchId?: string;
    onSuccess?: () => void;
}

export default function AssignScholarshipDrawer({
    isOpen,
    onClose,
    studentId,
    courseBranchId,
    onSuccess
}: Props) {
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id;

    const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
    const [selectedCourseBranch, setSelectedCourseBranch] = useState<any>(
        courseBranchId ? { value: courseBranchId, label: '' } : null
    );
    const [validUntil, setValidUntil] = useState<Date | null>(null);
    const [reason, setReason] = useState('');
    const [active, setActive] = useState(true);
    const [assigning, setAssigning] = useState(false);

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
                assignedBy: userId
            };

            const resp = await assignScholarship(studentId, payload as any);

            if (resp.success) {
                openNotification('success', 'Beca asignada correctamente');
                // Reset form
                setSelectedScholarship(null);
                setSelectedCourseBranch(courseBranchId ? { value: courseBranchId, label: '' } : null);
                setValidUntil(null);
                setReason('');
                setActive(true);

                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            } else {
                openNotification('error', resp.message);
            }
        } catch (e) {
            openNotification('error', 'Error al asignar beca');
        } finally {
            setAssigning(false);
        }
    };

    const handleClose = () => {
        // Reset form on close
        setSelectedScholarship(null);
        setSelectedCourseBranch(courseBranchId ? { value: courseBranchId, label: '' } : null);
        setValidUntil(null);
        setReason('');
        setActive(true);
        onClose();
    };

    return (
        <Drawer open={isOpen} onClose={handleClose} title="Asignar Beca" className="max-w-md">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Beca</label>
                        <SelectScholarship
                            value={selectedScholarship?.value}
                            onChange={setSelectedScholarship}
                            placeholder="Seleccionar beca..."
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Oferta Académica (Opcional)</label>
                        <SelectCourseBranch
                            value={selectedCourseBranch?.value}
                            onChange={setSelectedCourseBranch}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Válida Hasta (Opcional)</label>
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
                        <label className="text-xs text-gray-500 mb-1 block">Motivo (Opcional)</label>
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

                <div className="flex gap-2 mt-4">
                    <Button
                        type="button"
                        color="danger"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={assigning || !selectedScholarship}
                        className="flex-1"
                    >
                        {assigning ? 'Asignando...' : 'Asignar'}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
