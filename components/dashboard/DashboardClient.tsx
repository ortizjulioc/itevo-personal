"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, BookOpen, DollarSign, Activity, FileText, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, BookCheck, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import { BarChart, Bar, Legend } from "recharts";
import { es } from "date-fns/locale";
import { format } from "date-fns";

interface DashboardData {
  totalRevenue: number;
  activeStudentsCount: number;
  activeCoursesCount: number;
  salesChartData: { date: string; amount: number }[];
  revenueChange: number;
  studentsChange: number;
  completedCoursesCount: number;
  incomeExpenseChartData: { month: string; income: number; expense: number }[];
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

const TrendBadge = ({ value, label }: { value: number, label: string }) => {
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


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(amount);
};

export default function DashboardClient() {
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
          <p className="text-secondary opacity-70">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-center text-red-500">Error al cargar el dashboard</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 transition-transform group-hover:scale-125 dark:bg-primary/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos del Mes</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {formatCurrency(data.totalRevenue)}
              </h3>
              <TrendBadge value={data.revenueChange} label="vs mes pasado" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Students Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 transition-transform group-hover:scale-125 dark:bg-blue-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estudiantes Activos</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.activeStudentsCount}
              </h3>
              <TrendBadge value={data.studentsChange} label="crecimiento" />
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
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <BookCheck className="h-3 w-3" />
                <span>{data.completedCoursesCount} completados este mes</span>
              </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ROW 1: [Income Chart (col-span-2)] + [Top Courses (col-span-1)] */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-black/50 dark:backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingresos (Últimos 30 días)</h3>
              <p className="text-sm text-gray-500">Evolución de ventas y pagos recibidos</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), 'dd MMM', { locale: es })}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(label) => format(new Date(label), "d 'de' MMMM, yyyy", { locale: es })}
                  formatter={(value: any, name: any) => [formatCurrency(value as number), "Ingresos"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4361ee" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4361ee' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  <div className="flex h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
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

        {/* ROW 2: [Income vs Expense Chart (col-span-2)] + [Recent Transactions (col-span-1)] */}
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-black/50 dark:backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingresos vs Gastos (Últimos 6 Meses)</h3>
              <p className="text-sm text-gray-500">Comparativa histórica de flujo de caja</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.incomeExpenseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                <XAxis 
                  dataKey="month" 
                  tickFormatter={(val) => {
                    const [year, month] = val.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                    return format(date, 'MMM yyyy', { locale: es });
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `$${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6', opacity: 0.5 }}
                  contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(val) => {
                    const [year, month] = val.split('-');
                    return format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMMM yyyy', { locale: es });
                  }}
                  formatter={(value: any, name: any) => [formatCurrency(value as number), name === 'income' ? 'Ingresos' : 'Gastos']}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} formatter={(value) => <span className="text-gray-600 dark:text-gray-400 capitalize">{value === 'income' ? 'Ingresos' : 'Gastos'}</span>} />
                <Bar dataKey="income" name="income" fill="#4361ee" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
