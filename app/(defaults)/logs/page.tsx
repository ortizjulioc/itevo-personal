import { Metadata } from "next";
import ViewTitle from "@/components/common/ViewTitle";
import { objectToQueryString } from "@/utils";
import LogList from "./components/log-list";
import LogFilters from "./components/log-filters";
import LogFiltersToggle from "./components/log-filters-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { SUPER_ADMIN } from "@/constants/role.constant";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export const metadata: Metadata = {
    title: 'Logs del Sistema',
};

interface LogsProps {
    searchParams: Promise<{
        date?: string;
        description?: string;
        action?: string;
        success?: string;
        page?: string;
        showFilters?: string;
    }>;
}

export default async function LogsPage({ searchParams }: LogsProps) {
    const session = await getServerSession(authOptions);
    const userRoles = (session?.user as any)?.roles?.map((r: any) => r.normalizedName) || [];

    if (!userRoles.includes(SUPER_ADMIN)) {
        redirect('/unauthorized');
    }

    const params = await searchParams;
    const showFilters = params.showFilters === 'true';
    
    // Si no hay fecha, redirigir con la fecha de hoy por defecto
    if (!params.date) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const newParams = { ...params, date: today };
        redirect(`/logs?${objectToQueryString(newParams)}`);
    }

    const query = objectToQueryString(params);

    return (
        <div className="space-y-6">
            <ViewTitle 
                className="mb-6"
                title="Logs del Sistema" 
                rightComponent={
                    <LogFiltersToggle showFilters={showFilters} />
                } 
            />

            <LogFilters showFilters={showFilters} />

            <div className="panel border-0 shadow-none bg-transparent p-0">
                <LogList query={query} />
            </div>
        </div>
    );
}
