'use client';
import { useState } from 'react';
import IconDownload from '@/components/icon/icon-download';
import { SoldInventoryReportItem } from '@/services/report-service';
import Swal from 'sweetalert2';
import DatePicker from '@/components/ui/date-picker';
import { formatCurrency, formatNumber } from '@/utils';
import { Button } from '@/components/ui';
import StickyFooter from '@/components/common/sticky-footer';
import ProductSelectionDrawer from '@/components/reports/product-selection-drawer';
import Badge from '@/components/ui/badge';
import { IconX, IconPlus } from '@/components/icon';

const SoldInventoryReport = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [reportData, setReportData] = useState<SoldInventoryReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchReport = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      Swal.fire({
        icon: 'warning',
        title: 'Rango de fechas incompleto',
        text: 'Por favor selecciona una fecha de inicio y fin.',
      });
      return;
    }

    setLoading(true);
    try {
      const from = formatDate(dateRange[0]);
      const to = formatDate(dateRange[1]);
      let url = `/api/reports/inventory/sold?from=${from}&to=${to}`;

      if (selectedProducts.length > 0) {
        const productIds = selectedProducts.map(p => p.id).join(',');
        url += `&productIds=${productIds}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener el reporte');
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el reporte.',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!dateRange[0] || !dateRange[1]) return;
    const from = formatDate(dateRange[0]);
    const to = formatDate(dateRange[1]);
    let url = `/api/reports/inventory/sold/download?from=${from}&to=${to}`;

    if (selectedProducts.length > 0) {
      const productIds = selectedProducts.map(p => p.id).join(',');
      url += `&productIds=${productIds}`;
    }

    window.open(url, '_blank');
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const totalQuantity = reportData.reduce((acc, item) => acc + item.quantitySold, 0);
  const totalAmount = reportData.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold">Reporte de Ventas por Producto</h1>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex items-center gap-2">
            <label className="mb-0">Fecha:</label>
            <div className="w-64">
              <DatePicker
                mode="range"
                className="w-auto"
                value={dateRange}
                onChange={(dates) => {
                  if (Array.isArray(dates)) {
                    setDateRange(dates as [Date | null, Date | null]);
                  }
                }}
                placeholder="Seleccionar rango"
              />
            </div>
          </div>

          <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(true)}>
            <IconPlus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
            Seleccionar Productos
          </Button>

          <Button type="button" onClick={fetchReport} disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </Button>
          <Button type="button" color="success" icon={<IconDownload />} onClick={downloadReport} disabled={!dateRange[0] || !dateRange[1]}>
            Descargar Excel
          </Button>
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div className="w-full text-xs font-semibold text-gray-500 mb-1">Productos filtrados:</div>
          {selectedProducts.map(product => (
            <Badge key={product.id} variant="primary" outline className="flex items-center gap-1 pr-1">
              {product.name}
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="hover:bg-primary hover:text-white rounded-full p-0.5 transition-colors"
              >
                <IconX className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <ProductSelectionDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedProducts={selectedProducts}
        onSelectionChange={setSelectedProducts}
      />

      <div className="panel">
        <div className="table-responsive">
          <table className="table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th className="text-center">Cantidad Vendida</th>
                <th className="text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td className="text-center">{formatNumber(item.quantitySold, 0)}</td>
                    <td className="text-right">{formatCurrency(item.totalAmount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    No hay datos para mostrar. Selecciona un rango de fechas y haz clic en Buscar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {reportData.length > 0 && (
          <StickyFooter className='-mx-6 px-8 py-4 mt-6' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
            <div className="flex justify-end items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Total Cantidad:</span>
                <span className="font-bold text-xl">{formatNumber(totalQuantity)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Monto Total:</span>
                <span className="font-bold text-xl text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </StickyFooter>
        )}
      </div>
    </div>
  );
};

export default SoldInventoryReport;
