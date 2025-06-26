import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

// Obtener todos los productos con búsqueda y paginación
export async function getProducts(search = '', page = 1, top = 10) {
  const skip = (page - 1) * top;

  const where: PrismaTypes.ProductWhereInput = {
    deleted: false,
    OR: [
      { name: { contains: search } },
      { code: { contains: search } },
      { description: { contains: search } },
    ],
  };

  const [products, totalProducts] = await Promise.all([
    Prisma.product.findMany({
      where,
      skip,
      take: top,
      orderBy: { createdAt: 'desc' },
    }),
    Prisma.product.count({ where }),
  ]);

  return { products, totalProducts };
}

// Crear un producto
export async function createProduct(data: PrismaTypes.ProductCreateInput) {
  return await Prisma.product.create({ data });
}

// Buscar producto por ID
export async function findProductById(
  id: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) {
  return await prisma.product.findUnique({ where: { id, deleted: false } });
}

// Buscar producto por código
export async function findProductByCode(code: string) {
  return await Prisma.product.findUnique({ where: { code, deleted: false } });
}

// Actualizar producto por ID
export async function updateProductById(
  id: string,
  data: PrismaTypes.ProductUpdateInput,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
) {
  return await prisma.product.update({ where: { id }, data });
}

// Eliminar producto por ID (soft delete)
export async function deleteProductById(id: string) {
  return await Prisma.product.update({
    where: { id },
    data: { deleted: true },
  });
}
