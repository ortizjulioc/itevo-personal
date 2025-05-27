import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { Prisma as PrismaTypes } from '@prisma/client';

// Obtener todos los rangos de NCF con búsqueda, paginación y conteo total
export async function getNcfRanges(search = '', page = 1, top = 10) {
  const skip = (page - 1) * top;

  const where: PrismaTypes.NcfRangeWhereInput = {
    OR: [
      { prefix: { contains: search } },
      { authorizationNumber: { contains: search } },
    ],
    deleted: false,
  };

  const [ncfRanges, totalNcfRanges] = await Promise.all([
    Prisma.ncfRange.findMany({
      where,
      skip,
      take: top,
      orderBy: { createdAt: 'desc' },
    }),
    Prisma.ncfRange.count({ where }),
  ]);

  return { ncfRanges, totalNcfRanges };
}

// Crear un nuevo rango de NCF
export async function createNcfRange(data: PrismaTypes.NcfRangeCreateInput) {
  return await Prisma.ncfRange.create({ data });
}

// Buscar un rango de NCF por ID
export async function findNcfRangeById(id: string) {
  return await Prisma.ncfRange.findUnique({ where: { id, deleted: false } });
}

// Actualizar un rango de NCF por ID
export async function updateNcfRangeById(id: string, data: PrismaTypes.NcfRangeUpdateInput) {
  return await Prisma.ncfRange.update({ where: { id }, data });
}

// Eliminar un rango de NCF por ID (soft delete: marcar inactivo)
export async function deleteNcfRangeById(id: string) {
  return await Prisma.ncfRange.update({
    where: { id },
    data: { deleted: true },
  });
}
