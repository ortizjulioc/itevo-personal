'use client';
import React from 'react';
import { useFetchCashRegistersById } from "../../lib/cash-register/use-fetch-cash-register";
import ClosedCashRegisterDetails from "../../components/closed-cash-register-details";
import Skeleton from "@/components/common/Skeleton";
import { openNotification } from "@/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClosedCashRegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { CashRegister, loading, error } = useFetchCashRegistersById(React.use(params).id);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      openNotification('error', error);
    }
  }, [error]);

  useEffect(() => {
    if (CashRegister && CashRegister.status === 'OPEN') {
      router.replace(`/invoices/${CashRegister.id}`);
    }
  }, [CashRegister, router]);


  if (loading) return <Skeleton rows={6} />;

  if (!CashRegister) return <div>No se encontró la caja registradora.</div>;

  if (CashRegister.status === 'OPEN') return <Skeleton rows={6} />; // Briefly show skeleton while redirecting

  return (
    <ClosedCashRegisterDetails CashRegister={CashRegister} />
  );
}
