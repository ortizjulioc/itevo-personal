import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { CashBox } from "@prisma/client";

export interface CashBoxResponse {
  cashBoxes: CashBoxWithBranch[];
  total: number;
}

//interface cashbox con branch
interface CashBoxWithBranch extends CashBox {
  branch: {
    id: number;
    name: string;
  };
}

const useFetchCashBoxes = (query: string) => {
  const [CashBoxes, setCashBoxes] = useState<CashBoxWithBranch[]>([]);
  const [totalCashBoxes, setTotalCashBoxes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<CashBoxResponse>(`/cash-box?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCashBoxes(response.data?.cashBoxes || []);
        setTotalCashBoxes(response.data?.total || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener las Cajas Fisicas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { CashBoxes, totalCashBoxes, loading, error, setCashBoxes };
};

export const useFetchCashBoxById = (id: string) => {
  const [CashBox, setCashBox] = useState<CashBox | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCashBoxData = async (id: string) => {
      try {
        const response = await apiRequest.get<CashBox>(`/cash-box/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCashBox(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener las cajas fisicas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCashBoxData(id);
  }, [id]);

  return { CashBox, loading, error, setCashBox };
}

export default useFetchCashBoxes;
