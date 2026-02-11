import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { AccountReceivable, PaymentStatus, PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

type processReceivablePaymentProps = {
    unitPrice: number;
    accountReceivableId: string;
    invoiceId: string;
    prisma: PrismaTypes.TransactionClient;
};

export const getAccountsReceivable = async (
    filters: {
        status?: string;
        minAmount?: number;
        maxAmount?: number;
        dueDateStart?: Date;
        dueDateEnd?: Date;
        courseId?: string;
        studentId?: string;
    } = {},
    page: number = 1,
    top: number = 10
) => {
    const skip = (page - 1) * top;

    const whereClause: any = {};

    // Add studentId filter
    if (filters.studentId) {
        whereClause.studentId = filters.studentId;
    }

    // Add status filter
    if (filters.status) {
        whereClause.status = filters.status;
    }

    // Add amount range filter
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        whereClause.amount = {};
        if (filters.minAmount !== undefined) {
            whereClause.amount.gte = filters.minAmount;
        }
        if (filters.maxAmount !== undefined) {
            whereClause.amount.lte = filters.maxAmount;
        }
    }

    // Add due date range filter
    if (filters.dueDateStart || filters.dueDateEnd) {
        const dueDate: Record<string, Date> = {};
        if (filters.dueDateStart) {
            dueDate.gte = filters.dueDateStart;
        }
        if (filters.dueDateEnd) {
            dueDate.lte = filters.dueDateEnd;
        }

        if (Object.keys(dueDate).length > 0) {
            whereClause.dueDate = dueDate;
        }
    }

    // Add courseId filter via courseBranch relation
    if (filters.courseId) {
        whereClause.courseBranch = {
            courseId: filters.courseId,
        };
    }

    const [accountsReceivable, totalAccountsReceivable] = await Promise.all([
        Prisma.accountReceivable.findMany({
            orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
            select: {
                id: true,
                studentId: true,
                courseBranchId: true,
                amount: true,
                dueDate: true,
                concept: true,
                status: true,
                amountPaid: true,
                student: {
                    select: {
                        id: true,
                        code: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                courseBranch: {
                    select: {
                        id: true,
                        course: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            where: whereClause,
            skip: skip,
            take: top,
        }),
        Prisma.accountReceivable.count({
            where: whereClause,
        }),
    ]);

    return { accountsReceivable, totalAccountsReceivable };
};

export const findAccountReceivableById = async (id: string, prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma) => {
    const accountReceivable = await prisma.accountReceivable.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            studentId: true,
            courseBranchId: true,
            amount: true,
            dueDate: true,
            concept: true,
            status: true,
            amountPaid: true,
            student: {
                select: {
                    id: true,
                    code: true,
                    firstName: true,
                    lastName: true,
                },
            },
            courseBranch: {
                select: {
                    id: true,
                    course: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        },
                    },
                    teacher: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
    });

    return accountReceivable;
};

export const updateAccountReceivableById = async (
    id: string,
    data: PrismaTypes.AccountReceivableUpdateInput,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
): Promise<AccountReceivable> => {
    return prisma.accountReceivable.update({
        where: { id },
        data: {
            dueDate: data.dueDate,
            status: data.status,
            amount: data.amount,
            amountPaid: data.amountPaid,
        },
    });
};

export const createAccountReceivable = async (data: { studentId: string; courseBranchId: string; amount: number; dueDate: Date; status?: PaymentStatus; amountPaid?: number }) => {
    const accountReceivable = await Prisma.accountReceivable.create({
        data: {
            student: {
                connect: { id: data.studentId },
            },
            courseBranch: {
                connect: { id: data.courseBranchId },
            },
            amount: data.amount,
            dueDate: data.dueDate,
            status: data.status || PaymentStatus.PENDING,
            amountPaid: data.amountPaid || 0,
        },
    });
    return accountReceivable;
};

export const createManyAccountsReceivable = async (
    data: {
        studentId: string;
        courseBranchId: string;
        amount: number;
        dueDate: Date;
        status?: PaymentStatus;
        amountPaid?: number;
    }[],
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
    const formattedData = data.map((item) => ({
        studentId: item.studentId,
        courseBranchId: item.courseBranchId,
        amount: item.amount,
        dueDate: item.dueDate,
        status: item.status || PaymentStatus.PENDING,
        amountPaid: item.amountPaid || 0,
    }));

    const result = await prisma.accountReceivable.createMany({
        data: formattedData,
    });

    return { count: result.count };
};

export const cancelAccountReceivableById = async (id: string) => {
    return Prisma.accountReceivable.update({
        where: { id },
        data: {
            status: PaymentStatus.CANCELED,
            amountPaid: 0,
        },
    });
};

export const processReceivablePayment = async ({ unitPrice, accountReceivableId, invoiceId, prisma }: processReceivablePaymentProps) => {
    const receivable = await findAccountReceivableById(accountReceivableId, prisma);

    if (!receivable) {
        throw new Error(`Cuenta por cobrar ${accountReceivableId} no encontrada`);
    }
    if (receivable.status !== PaymentStatus.PENDING) {
        throw new Error(`La cuenta por cobrar ${accountReceivableId} ya no está pendiente`);
    }

    const amountPending = receivable.amount - receivable.amountPaid;
    if (amountPending < unitPrice) {
        throw new Error(`No puede agregar más cantidad que el monto pendiente de la cuenta por cobrar ${accountReceivableId} (pendiente: ${amountPending})`);
    }

    const newAmountPending = amountPending - unitPrice;
    const amountPaid = receivable.amount - newAmountPending;

    // Actualizamos cuenta por cobrar
    const accountReceivableUpdated = await updateAccountReceivableById(
        accountReceivableId,
        {
            amountPaid,
            status: amountPaid >= receivable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING,
        },
        prisma
    );

    // Crear pago de cuenta por cobrar
    const receivablePayment = await prisma.receivablePayment.create({
        data: {
            accountReceivableId,
            amount: unitPrice,
            paymentDate: new Date(),
            invoiceId, // Asociar el pago a la factura
        },
    });

    return {
        receivablePayment,
        accountReceivable: accountReceivableUpdated,
    };
};

export const annularReceivablePayment = async ({ unitPrice, accountReceivableId, invoiceId, prisma }: processReceivablePaymentProps) => {
    const receivable = await findAccountReceivableById(accountReceivableId, prisma);

    if (!receivable) {
        throw new Error(`Cuenta por cobrar ${accountReceivableId} no encontrada`);
    }

    const amountPaid = receivable.amountPaid - unitPrice;
    if (amountPaid < 0) {
        throw new Error(`No puede anular más cantidad que el monto pagado de la cuenta por cobrar ${accountReceivableId} (pagado: ${receivable.amountPaid})`);
    }

    const newStatus = amountPaid >= receivable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING;

    // Actualizamos cuenta por cobrar
    const accountReceivableUpdated = await updateAccountReceivableById(
        accountReceivableId,
        {
            amountPaid,
            status: newStatus,
        },
        prisma
    );

    // Anular pago de cuenta por cobrar
    const receivablePayment = await prisma.receivablePayment.update({
        where: {
            accountReceivableId_invoiceId: { accountReceivableId: accountReceivableId, invoiceId: invoiceId },
        },
        data: { deleted: true },
    });

    return { accountReceivable: accountReceivableUpdated, receivablePayment };
};

export const changeAccountReceivableStatus = async (id: string, status: PaymentStatus, prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma) => {
    return prisma.accountReceivable.update({
        where: { id },
        data: { status },
    });
};

import { EnrollmentStatus, ScholarshipType } from '@prisma/client';
import { addDaysToDate, getNextDayOfWeek } from '@/utils/date';
import { addMonths } from 'date-fns';

export const generateEnrollmentReceivables = async (enrollmentId: string, prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma) => {
    // 1. Obtener enrollment con datos necesarios
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            student: true,
            courseBranch: {
                include: {
                    course: true,
                    paymentPlan: true,
                },
            },
        },
    });

    if (!enrollment || !enrollment.courseBranch || !enrollment.courseBranch.paymentPlan) {
        throw new Error('Enrollment, CourseBranch or PaymentPlan not found');
    }

    const { student, courseBranch } = enrollment;
    const { paymentPlan } = courseBranch;

    if (!paymentPlan) {
        throw new Error('Payment plan not found');
    }

    // 2. Verificar si ya existen cuentas por cobrar para este enrollment (idempotencia basica)
    // Usamos una busqueda por studentId y courseBranchId y concepto similar, o idealmente si tuvieramos enrollmentId en AR
    // Como no hay enrollmentId en AR, buscamos por student y courseBranch y fecha reciente o estado pendiente
    const existingReceivables = await prisma.accountReceivable.count({
        where: {
            studentId: student.id,
            courseBranchId: courseBranch.id,
            // Opcional: filtrar por fecha de creación reciente para no confundir con inscripciones pasadas si se permite re-inscripcion
            // Pero por ahora asumimos que si hay deuda pendiente o pagada asociada a este curso, ya se generaron.
        },
    });

    if (existingReceivables > 0) {
        console.log(`Receivables already exist for student ${student.id} in course ${courseBranch.id}`);
        return []; // Ya existen, no hacemos nada
    }

    const receivables: any[] = [];
    const startDate = new Date(courseBranch.startDate || new Date());

    // 3. Detección de beca
    const activeScholarship = await prisma.studentScholarship.findFirst({
        where: {
            studentId: student.id,
            active: true,
            OR: [{ courseBranchId: courseBranch.id }, { courseBranchId: null }],
            scholarship: { isActive: true },
        },
        include: { scholarship: true },
        orderBy: { courseBranchId: 'desc' },
    });

    // 4. Cálculo del monto base por cuota y matrícula
    let amountPerInstallment = courseBranch.amount;
    let enrollmentAmount = courseBranch.enrollmentAmount || 0;
    let conceptSuffix = '';

    if (activeScholarship && activeScholarship.scholarship) {
        const { type, value, name } = activeScholarship.scholarship;
        let installmentDiscount = 0;
        let enrollmentDiscount = 0;

        if (type === ScholarshipType.percentage) {
            installmentDiscount = amountPerInstallment * (value / 100);
            enrollmentDiscount = enrollmentAmount * (value / 100);
        } else if (type === ScholarshipType.fixed_amount) {
            installmentDiscount = value;
            enrollmentDiscount = value;
        }

        if (installmentDiscount > amountPerInstallment) installmentDiscount = amountPerInstallment;
        amountPerInstallment -= installmentDiscount;

        if (enrollmentDiscount > enrollmentAmount) enrollmentDiscount = enrollmentAmount;
        enrollmentAmount -= enrollmentDiscount;

        conceptSuffix = ` (Beca: ${name})`;
    }

    // 5. Generar Cobro de Inscripción
    if (enrollmentAmount > 0) {
        receivables.push({
            amount: enrollmentAmount,
            studentId: student.id,
            courseBranchId: courseBranch.id,
            dueDate: startDate,
            status: PaymentStatus.PENDING,
            concept: `Inscripción al curso ${courseBranch?.course?.name || ''}${conceptSuffix}`,
        });
    }

    // 6. Generar Cuotas
    for (let i = 0; i < paymentPlan.installments; i++) {
        let dueDate = new Date(startDate);

        switch (paymentPlan.frequency) {
            case 'MONTHLY':
                const dateWithDay = addDaysToDate(dueDate, paymentPlan.dayOfMonth || dueDate.getDate());
                dueDate = addMonths(dateWithDay, i + 1);
                break;

            case 'WEEKLY':
                if (i === 0) {
                    dueDate = getNextDayOfWeek(startDate, paymentPlan.dayOfWeek ?? startDate.getDay(), true);
                } else {
                    dueDate = new Date(getNextDayOfWeek(startDate, paymentPlan.dayOfWeek ?? startDate.getDay(), true));
                    dueDate.setDate(dueDate.getDate() + i * 7);
                }
                break;

            case 'BIWEEKLY':
                dueDate.setDate(dueDate.getDate() + i * 14);
                break;

            case 'PER_CLASS':
                dueDate.setDate(dueDate.getDate() + i * 7);
                break;

            case 'ONCE':
                if (i === 0) {
                    dueDate.setDate(dueDate.getDate());
                } else {
                    continue;
                }
                break;

            default:
                // throw new Error(`Unsupported frequency: ${paymentPlan.frequency}`);
                // Log instead of throw to avoid breaking entire transaction? or throw to be safe.
                break;
        }

        if (paymentPlan.graceDays && paymentPlan.graceDays > 0) {
            dueDate.setDate(dueDate.getDate() + paymentPlan.graceDays);
        }

        if (amountPerInstallment > 0) {
            receivables.push({
                studentId: student.id,
                courseBranchId: courseBranch.id,
                amount: amountPerInstallment,
                dueDate,
                status: PaymentStatus.PENDING,
                concept: `Cuota ${i + 1} de ${paymentPlan.installments} - Curso: ${courseBranch?.course?.name || ''}${conceptSuffix}`,
            });
        }
    }

    // 7. Insertar en BD
    if (receivables.length > 0) {
        await prisma.accountReceivable.createMany({
            data: receivables,
        });
    }

    return receivables;
};
