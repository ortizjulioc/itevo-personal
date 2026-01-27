import React, { useEffect, useState } from 'react';
import { formatCurrency, formatNumber } from '@/utils';
import { SoldInventoryReportItem } from '@/services/report-service';
import { GenericSkeleton } from '@/components/common/Skeleton';

interface CashRegisterProductReportProps {
  cashRegisterId: string;
}

const CashRegisterProductReport: React.FC<CashRegisterProductReportProps> = ({ cashRegisterId }) => {
  const [reportData, setReportData] = useState<SoldInventoryReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/inventory/sold?cashRegisterId=${cashRegisterId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el reporte de productos');
        }
        const data = await response.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cashRegisterId) {
      fetchReport();
    }
  }, [cashRegisterId]);

  const totalQuantity = reportData.reduce((acc, item) => acc + item.quantitySold, 0);
  const totalAmount = reportData.reduce((acc, item) => acc + item.totalAmount, 0);

  if (loading) {
    return (
      <div className="mt-6">
        <span className="ml-3 text-lg font-bold">Ventas por Producto</span>
        <div className="panel mt-2">
          <GenericSkeleton lines={5} withHeader={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <span className="ml-3 text-lg font-bold">Ventas por Producto</span>
        <div className="panel mt-2 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (reportData.length === 0) {
    return (
      <div className="mt-6">
        <span className="ml-3 text-lg font-bold">Ventas por Producto</span>
        <div className="panel mt-2 p-4 text-gray-500">
          No hubo ventas de productos en este cierre.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <span className="ml-3 text-lg font-bold">Ventas por Producto</span>
      <div className="panel mt-2 p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productCode}</td>
                  <td>{item.productName}</td>
                  <td className="text-center">{formatNumber(item.quantitySold, 0)}</td>
                  <td className="text-right font-semibold">{formatCurrency(item.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-900 font-bold">
                <td colSpan={2} className="text-right">Total:</td>
                <td className="text-center">{formatNumber(totalQuantity, 0)}</td>
                <td className="text-right">{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashRegisterProductReport;
