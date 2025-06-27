export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { findInvoiceById, InvoiceWithItems } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { InvoiceStatus } from '@prisma/client';
// const PDFDocument = require('pdfkit');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Obtener la factura con sus ítems
    const invoice: InvoiceWithItems | null = await findInvoiceById(id);

    if (!invoice) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    if (invoice.status !== InvoiceStatus.PAID) {
      throw new Error('Solo se pueden imprimir facturas pagadas');
    }

    // Crear el documento PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('error', (err: Error) => {
      throw new Error(`Error al generar PDF: ${err.message}`);
    });

    // Diseño de la factura
    generateInvoicePDF(doc, invoice);

    // Finalizar el documento
    doc.end();

    // Convertir los buffers a un solo Buffer
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
    });

    // Registrar log de éxito
    await createLog({
      action: 'GET',
      description: `Factura ${invoice.invoiceNumber} generada como PDF`,
      origin: `invoices/${id}/print`,
      elementId: id,
      success: true,
    });

    // Devolver el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Factura_${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    // Registrar log de error
    await createLog({
      action: 'GET',
      description: `Error al generar PDF para factura ${id}: ${formatErrorMessage(error)}`,
      origin: `invoices/${id}/print`,
      success: false,
    });

    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Función para diseñar la factura
function generateInvoicePDF(doc: PDFKit.PDFDocument, invoice: InvoiceWithItems) {
  // Usar fuente estándar para evitar problemas
  doc.font('Helvetica');

  // Encabezado
  doc.fontSize(20).text('Factura', 50, 50);
  doc.fontSize(12)
    .text(`Número: ${invoice.invoiceNumber}`, 50, 80)
    .text(`NCF: ${invoice.ncf}`, 50, 95)
    .text(`Fecha: ${new Date(invoice.date).toLocaleDateString('es-DO')}`, 50, 110)

  // Información del cliente
  doc.fontSize(14).text('Cliente', 50, 160);
  doc.fontSize(12);

  // Tabla de ítems
  doc.fontSize(14).text('Detalles de la Factura', 50, 240);
  const tableTop = 260;
  const itemCodeX = 50;
  const descriptionX = 100;
  const quantityX = 300;
  const unitPriceX = 350;
  const subtotalX = 400;
  const itbisX = 450;

  // Encabezados de la tabla
  doc.fontSize(10)
    .text('Código', itemCodeX, tableTop)
    .text('Descripción', descriptionX, tableTop)
    .text('Cantidad', quantityX, tableTop)
    .text('Precio Unit.', unitPriceX, tableTop)
    .text('Subtotal', subtotalX, tableTop)
    .text('ITBIS', itbisX, tableTop);

  // Línea separadora
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // Filas de ítems
  let y = tableTop + 25;
  invoice.items.forEach((item) => {
    const description = 'Descripción del ítem'; // Aquí puedes usar item.description si está disponible

    doc.text(description, descriptionX, y, { width: 190 })
      .text(item.quantity?.toString() || '', quantityX, y)
      .text(item.unitPrice.toFixed(2), unitPriceX, y)
      .text(item.subtotal.toFixed(2), subtotalX, y)
      .text(item.itbis.toFixed(2), itbisX, y);
    y += 20;
  });

  // Totales
  const totalY = y + 20;
  doc.fontSize(12)
    .text(`Subtotal: ${invoice.subtotal.toFixed(2)}`, 400, totalY)
    .text(`ITBIS: ${invoice.itbis.toFixed(2)}`, 400, totalY + 15)
    .text(`Total: ${(invoice.subtotal + invoice.itbis).toFixed(2)}`, 400, totalY + 30);

  // Información de la empresa
  doc.fontSize(10)
    .text('Empresa Ejemplo SRL', 50, totalY + 60)
    .text('RNC: 123-456-789', 50, totalY + 75)
    .text('Teléfono: 809-123-4567', 50, totalY + 90);
}