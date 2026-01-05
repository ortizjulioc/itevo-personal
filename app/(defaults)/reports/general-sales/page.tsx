'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from '@/components/ui/date-picker';
import Select from 'react-select';
import { formatCurrency } from '@/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from '@/components/ui/button';
import { IconFile, IconSearch, IconDownload } from '@/components/icon';
import ViewTitle from '@/components/common/ViewTitle';
import Swal from 'sweetalert2';
import { INVOICE_STATUS_OPTIONS, PAYMENT_METHODS_OPTIONS } from '@/constants/invoice.constant';
import { InvoiceStatus } from '@prisma/client';

const GeneralSalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    dateRange: [new Date(), new Date()] as [Date | null, Date | null],
    status: [] as any[],
    ncfType: [] as any[],
    paymentMethod: null as any,
    studentId: '',
    userId: '',
    minAmount: '',
    maxAmount: ''
  });

  const statusOptions = [
    { value: 'PAID', label: 'Pagada' },
    { value: 'COMPLETED', label: 'Completada' },
    { value: 'DRAFT', label: 'Borrador' },
    { value: 'CANCELED', label: 'Cancelada' }
  ];

  const ncfTypeOptions = [
    { value: '01', label: 'Crédito Fiscal (01)' },
    { value: '02', label: 'Consumo (02)' },
    { value: '11', label: 'Comprobante Compras (11)' },
    { value: '14', label: 'Regímenes Especiales (14)' },
    { value: '15', label: 'Gubernamental (15)' }
  ];

  const paymentMethodOptions = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.dateRange[0]) params.append('from', filters.dateRange[0].toISOString());
      if (filters.dateRange[1]) params.append('to', filters.dateRange[1].toISOString());
      if (filters.status.length > 0) params.append('status', filters.status.map(s => s.value).join(','));
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod.value);
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

      const response = await fetch(`/api/reports/general?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar reporte');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo cargar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const params = new URLSearchParams();
    if (filters.dateRange[0]) params.append('from', filters.dateRange[0].toISOString());
    if (filters.dateRange[1]) params.append('to', filters.dateRange[1].toISOString());
    if (filters.status.length > 0) params.append('status', filters.status.map(s => s.value).join(','));
    if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod.value);
    if (filters.studentId) params.append('studentId', filters.studentId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.minAmount) params.append('minAmount', filters.minAmount);
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

    window.open(`/api/reports/general/download?${params.toString()}`, '_blank');
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div>
      <ViewTitle title="Reporte General de Ventas" />

      <div className="panel mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label>Rango de Fechas</label>
            <DatePicker
              mode="range"
              value={filters.dateRange}
              onChange={(date) => setFilters({ ...filters, dateRange: date as [Date | null, Date | null] })}
              className="form-input"
            />
          </div>
          <div>
            <label>Estado</label>
            <Select
              isMulti
              options={statusOptions}
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val as any[] })}
              placeholder="Seleccionar estado..."
            />
          </div>

          <div>
            <label>Método de Pago</label>
            <Select
              options={paymentMethodOptions}
              value={filters.paymentMethod}
              onChange={(val) => setFilters({ ...filters, paymentMethod: val })}
              placeholder="Seleccionar método..."
              isClearable
            />
          </div>
          <div>
            <label>Monto Mínimo</label>
            <input
              type="number"
              className="form-input"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label>Monto Máximo</label>
            <input
              type="number"
              className="form-input"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <Button
            color="primary"
            onClick={fetchReport}
            disabled={loading}
            icon={<IconSearch />}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button
            color="success"
            onClick={handleDownload}
            disabled={loading}
            icon={<IconDownload />}
          >
            Descargar Excel
          </Button>
        </div>

        <div className="table-responsive">
          <table className="table-hover">
            <thead>
              <tr>
                <th>No. Factura</th>
                <th>Fecha</th>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Método Pago</th>
                <th>Creado Por</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">No se encontraron resultados</td>
                </tr>
              ) : (
                reportData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.invoiceNumber}</td>
                    <td>{format(new Date(item.date), 'dd/MM/yyyy', { locale: es })}</td>
                    <td>
                      <div>{item.studentName}</div>
                      <div className="text-xs text-gray-500">{item.studentCode}</div>
                    </td>
                    <td>
                      <span className={`badge ${item.status === InvoiceStatus.PAID ? 'badge-outline-success' :
                        item.status === InvoiceStatus.COMPLETED ? 'badge-outline-primary' :
                          item.status === InvoiceStatus.CANCELED ? 'badge-outline-danger' :
                            'badge-outline-warning'
                        }`}>
                        {INVOICE_STATUS_OPTIONS[item.status as keyof typeof INVOICE_STATUS_OPTIONS]}
                      </span>
                    </td>
                    <td>{item.isCredit ? 'Crédito' : PAYMENT_METHODS_OPTIONS[item.paymentMethod as keyof typeof PAYMENT_METHODS_OPTIONS] || item.paymentMethod}</td>
                    <td>{item.createdBy}</td>
                    <td className="text-right font-bold">{formatCurrency(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-50 dark:bg-gray-800">
                <td colSpan={6} className="text-right">Total General:</td>
                <td className="text-right">
                  {formatCurrency(reportData.reduce((sum, item) => sum + item.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneralSalesReport;
