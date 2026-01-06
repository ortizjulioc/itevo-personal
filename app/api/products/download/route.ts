import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/services/product-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';

    const products = await getAllProducts(search);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.columns = [
      { header: 'Código', key: 'code', width: 10 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Descripción', key: 'description', width: 40 },
      { header: 'Precio', key: 'price', width: 15 },
      { header: 'Costo', key: 'cost', width: 15 },
      { header: 'Stock', key: 'stock', width: 10 },
    ];

    products.forEach(product => {
      worksheet.addRow({
        code: product.code,
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
      });
    });

    // Format currency columns
    worksheet.getColumn('price').numFmt = '"$"#,##0.00';
    worksheet.getColumn('cost').numFmt = '"$"#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="productos.xlsx"`,
      },
    });

  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'products/download',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
