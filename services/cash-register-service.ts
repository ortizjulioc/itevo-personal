import 'server-only';
import { CashRegister as PrismaCashRegister, PrismaClient, CashRegisterStatus } from "@prisma/client";

const Prisma = new PrismaClient();

export type CashRegisterCreateInput = Omit<
  PrismaCashRegister,
  'id' | 'createdAt' | 'updatedAt' | 'deleted'
>;

type CashRegisterUpdateInput = Partial<CashRegisterCreateInput>;


// Obtener lista paginada de cajas registradoras con búsqueda opcional por nombre
export const getCashRegisters = async (search: string, page: number, top: number) => {
  const skip = (page - 1) * top;

  const cashRegisters = await Prisma.cashRegister.findMany({
    orderBy: [{ openingDate: 'desc' }],
    skip,
    take: top,
    where: {
      deleted: false,
      name: { contains: search },
    },
    select: {
      id: true,
      name: true,
      status: true,
      openingDate: true,
      initialBalance: true,
      branch: {
        select: { id: true, name: true }
      },
      user: {
        select: { id: true, name: true }
      }
    }
  });

  const total = await Prisma.cashRegister.count({
    where: {
      deleted: false,
      name: { contains: search },
    }
  });

  return { cashRegisters, total };
};

// Crear una nueva caja registradora
export const createCashRegister = async (data: CashRegisterCreateInput) => {
  const cashRegister = await Prisma.cashRegister.create({
    data: data as any,
  });
  return cashRegister;
};

// Obtener una caja registradora por ID
export const findCashRegisterById = async (id: string) => {
  return Prisma.cashRegister.findUnique({
    where: { id, deleted: false },
    select: {
      id: true,
      name: true,
      status: true,
      openingDate: true,
      initialBalance: true,
      cashBreakdown: true,
      deleted: true,
      branch: {
        select: { id: true, name: true }
      },
      user: {
        select: { id: true, name: true }
      },
      createdAt: true,
      updatedAt: true
    }
  });
};

// Actualizar una caja registradora por ID
export const updateCashRegisterById = async (id: string, data: CashRegisterUpdateInput) => {
  return Prisma.cashRegister.update({
    where: { id },
    data: data as any,
  });
};

// Eliminar caja registradora (soft delete)
export const deleteCashRegisterById = async (id: string) => {
  return Prisma.cashRegister.update({
    where: { id },
    data: { deleted: true },
  });
};
