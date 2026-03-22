"use client";

import React, { useEffect, useState } from "react";
import { Users, BookOpen, Activity, FileText, ArrowUpRight, ArrowDownRight, ArrowDown, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardData {
  activeStudentsCount: number;
  studentsChange: number;
  activeCoursesCount: number;
  topCoursesData: { id: string; name: string; enrollments: number; capacity: number; occupancyRate: number }[];
  recentTransactions: {
    id: string;
    amount: number;
    type: string;
    description: string;
    createdAt: string;
    referenceType: string;
    user: { name: string; lastName: string };
  }[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(amount);
};

const TrendBadgeLocal = ({ value, label }: { value: number, label: string }) => {
  const isPositive = value >= 0;
  return (
    <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      </span>
      <span>{Math.abs(value).toFixed(1)}% {label}</span>
    </div>
  );
};

export default function AssistantDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md"></div>
          <p className="text-secondary opacity-70">Cargando métricas de asistencia...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-4 text-center text-red-500">Error al cargar el dashboard</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Students Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 transition-transform group-hover:scale-125 dark:bg-blue-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estudiantes Activos</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.activeStudentsCount}
              </h3>
              <TrendBadgeLocal value={data.studentsChange} label="crecimiento" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-125 dark:bg-emerald-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cursos en Progreso</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.activeCoursesCount}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 transition-transform group-hover:scale-125 dark:bg-purple-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transacciones de Hoy</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.recentTransactions.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Courses */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-black/50 dark:backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cursos Populares</h3>
          </div>
          
          <div className="space-y-6">
            {data.topCoursesData.length > 0 ? (
              data.topCoursesData.map((course, index) => (
                <div key={course.id} className="relative">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white line-clamp-1 pr-2">
                       {index + 1}. {course.name}
                    </span>
                    <span className="text-gray-500 font-medium whitespace-nowrap">
                       {course.enrollments} {course.capacity > 0 && `/ ${course.capacity}`}
                    </span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div 
                      className={`flex flex-col justify-center overflow-hidden text-center whitespace-nowrap text-white ${course.occupancyRate >= 90 ? 'bg-red-500' : course.occupancyRate >= 70 ? 'bg-orange-500' : 'bg-primary'}`} 
                      role="progressbar" 
                      style={{ width: `${Math.min(100, course.occupancyRate || (course.enrollments > 0 ? 10 : 0))}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex h-32 flex-col items-center justify-center text-gray-400">
                    <BookOpen className="mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No hay cursos activos</p>
                </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-black/50 dark:backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transacciones Recientes</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${tx.type === 'INCOME' ? 'border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5' : 'border-red-50 hover:bg-red-50/50 dark:border-red-900/30 dark:hover:bg-red-900/10'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tx.type === 'INCOME' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'INCOME' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {tx.description || (tx.type === 'INCOME' ? "Ingreso" : "Gasto")}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{format(new Date(tx.createdAt), "dd MMM HH:mm", { locale: es })}</span>
                        <span>•</span>
                        <span className="capitalize">{tx.referenceType.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'INCOME' ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      por {tx.user.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-gray-400">
                 <FileText className="mb-2 h-8 w-8 opacity-50" />
                 <p className="text-sm">No hay transacciones recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
