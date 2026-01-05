'use client';
import { useState } from 'react';
import IconDownload from '@/components/icon/icon-download';
import { SoldCourseReportItem } from '@/services/report-service';
import Swal from 'sweetalert2';
import DatePicker from '@/components/ui/date-picker';
import { formatCurrency, formatNumber } from '@/utils';
import { Button } from '@/components/ui';
import StickyFooter from '@/components/common/sticky-footer';

const SoldCoursesReport = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [reportData, setReportData] = useState<SoldCourseReportItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(`/api/reports/courses/sold?from=${from}&to=${to}`);

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
    window.open(`/api/reports/courses/sold/download?from=${from}&to=${to}`, '_blank');
  };

  const totalQuantity = reportData.reduce((acc, item) => acc + item.quantitySold, 0);
  const totalAmount = reportData.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold">Reporte de Ventas por Curso</h1>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex items-center gap-2">
            <label className="mb-0">Fecha:</label>
            <div className="w-64">
              <DatePicker
                mode="range"
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
          <Button type="button" onClick={fetchReport} disabled={loading}>
            {loading ? 'Cargando...' : 'Buscar'}
          </Button>
          <Button type="button" color="success" icon={<IconDownload />} onClick={downloadReport} disabled={!dateRange[0] || !dateRange[1]}>
            Descargar Excel
          </Button>
        </div>
      </div>

      <div className="panel">
        <div className="table-responsive">
          <table className="table-hover">
            <thead>
              <tr>
                <th>Código</th>
                <th>Curso</th>
                <th className="text-center">Cantidad Vendida</th>
                <th className="text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item) => (
                  <tr key={item.courseId}>
                    <td>{item.courseCode}</td>
                    <td>{item.courseName}</td>
                    <td className="text-center">{item.quantitySold}</td>
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

export default SoldCoursesReport;
