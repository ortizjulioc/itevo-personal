import 'server-only';
import { CashRegister as PrismaCashRegister, CashRegisterStatus } from "@prisma/client";
import { Prisma } from '@/utils/lib/prisma';

export type CashRegisterCreateInput = Omit<
  PrismaCashRegister,
  'id' | 'createdAt' | 'updatedAt' | 'deleted'
>;

type CashRegisterUpdateInput = Partial<CashRegisterCreateInput>;

interface GetCashRegisterParams {
  search?: string;
  page: number;
  top: number;
  branchId?: string;
  userId?: string;
  status?: CashRegisterStatus;
}

export const getCashRegisters = async ({
  search = '',
  page,
  top,
  branchId,
  userId,
  status,
}: GetCashRegisterParams) => {
  const skip = (page - 1) * top;

  const whereClause: any = {
    deleted: false,
  };

  if (search) {
    whereClause.name = {
      contains: search,
    };
  }
  if (branchId) whereClause.branchId = branchId;
  if (userId) whereClause.userId = userId;
  if (status) whereClause.status = status;

  const [cashRegisters, total] = await Promise.all([
    Prisma.cashRegister.findMany({
      orderBy: [{ openingDate: 'desc' }],
      skip,
      take: top,
      where: whereClause,
      select: {
        id: true,
        name: true,
        status: true,
        openingDate: true,
        initialBalance: true,
        branch: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
    }),
    Prisma.cashRegister.count({ where: whereClause }),
  ]);

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

export const calculateExpectedTotalForCashRegister = async (cashRegisterId: string) => {
  const cashRegister = await Prisma.cashRegister.findUnique({
    where: { id: cashRegisterId, deleted: false },
    select: {
      id: true,
      initialBalance: true,
      openingDate: true,
    },
  });

  if (!cashRegister) throw new Error('Cash register not found');


  // Filtrar movimientos dentro del rango válido
  const cashMovements = await Prisma.cashMovement.findMany({
    where: {
      cashRegisterId,
    },
    select: {
      amount: true,
      type: true,
    },
  });

  const totalMovements = cashMovements.reduce((total, movement) => {
    return movement.type === 'INCOME'
      ? total + movement.amount
      : total - movement.amount;
  }, 0);

  const expectedTotal = cashRegister.initialBalance + totalMovements;

  return expectedTotal;
};
