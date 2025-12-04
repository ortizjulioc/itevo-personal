import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getServerSession } from 'next-auth';

// Obtener todos los productos con búsqueda y paginación
export async function getProducts(search = '', page = 1, top = 10) {
  const session = await getServerSession(authOptions);
  const branchId = session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || undefined;

  const skip = (page - 1) * top;

  const where: PrismaTypes.ProductWhereInput = {
    deleted: false,
    OR: [
      { name: { contains: search } },
      { description: { contains: search } },
    ],
    ...(branchId ? { branchId } : {}),
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
  const session = await getServerSession(authOptions);
  const branchId = session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || undefined;
  return await prisma.product.findUnique({ where: 
    { id, deleted: false, ...(branchId ? { branchId } : {}) }
  });
}

// Buscar producto por código
export async function findProductByCode(code: number) {
  const session = await getServerSession(authOptions);
  const branchId = session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || undefined;
  return await Prisma.product.findUnique({ where: { code, deleted: false, ...(branchId ? { branchId } : {}) } });
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
