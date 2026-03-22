"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { DollarSign, Activity, FileText, ArrowUp, ArrowDown } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";

interface DashboardData {
  totalRevenue: number;
  revenueChange: number;
  salesChartData: { date: string; amount: number }[];
  incomeExpenseChartData: { month: string; income: number; expense: number }[];
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

export default function BillingDashboardClient() {
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
          <p className="text-secondary opacity-70">Cargando métricas financieras...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-4 text-center text-red-500">Error al cargar el dashboard</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Revenue Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 transition-transform group-hover:scale-125 dark:bg-primary/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos del Mes</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {formatCurrency(data.totalRevenue)}
              </h3>
              <TrendBadgeLocal value={data.revenueChange} label="vs mes pasado" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Sales Activity Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-black/50 dark:backdrop-blur-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-125 dark:bg-emerald-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado General</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Saludable
              </h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span>Operaciones de cobro activas</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-black/50 dark:backdrop-blur-md">
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

        {/* Income vs Expenses Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-black/50 dark:backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingresos vs Gastos (6 Meses)</h3>
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
      </div>
    </div>
  );
}
