'use client';
import { Button } from '@/components/ui';
import { openNotification } from '@/utils';
import { HiOutlinePlus } from "react-icons/hi";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function NewQuotationButton({ className }: { className?: string }) {
    const route = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handleCreateQuotation = async () => {
        setLoading(true);
        const userId = (session?.user as any)?.id;

        if (!userId) {
            openNotification('error', 'Sesión no válida o usuario no identificado');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                createdBy: userId,
                branchId: (session?.user as any)?.activeBranchId
            })
            });

            const data = await res.json();

            if (res.ok) {
                openNotification('success', 'Cotización creada correctamente');
                route.push(`/quotations/${data.id}`);
            } else {
                openNotification('error', data.message || data.error || 'Error al crear la cotización');
                setLoading(false);
            }
        } catch (error) {
            openNotification('error', 'Error en la conexión con el servidor');
            setLoading(false);
        }
    };

    return (
        <Button
            className={className}
            color="primary"
            onClick={handleCreateQuotation}
            loading={loading}
            icon={!loading ? <HiOutlinePlus className="size-5" /> : undefined}
        >
            Nueva Cotización
        </Button>
    )
}
