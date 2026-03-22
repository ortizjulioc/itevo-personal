"use client";

import React from "react";
import Link from "next/link";
import { Receipt, ArrowRight } from "lucide-react";

export default function CashierDashboardClient() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quick Action: Start Billing */}
        <Link href="/invoices" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:bg-black/50 dark:backdrop-blur-md block border border-transparent hover:border-primary/20">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 transition-transform duration-500 group-hover:scale-125 dark:bg-primary/20"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 shadow-sm">
                <Receipt className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
                  Módulo de Facturación
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Empezar o seguir facturando
                </p>
              </div>
            </div>
            
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
