const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCashRegisterInvoicesSummary(prisma, cashRegisterId) {
    // Obtener caja
    const cashRegister = await prisma.cashRegister.findUnique({
        where: { id: cashRegisterId, deleted: false },
        select: {
            id: true,
            initialBalance: true,
            openingDate: true,
        },
    });

    if (!cashRegister) throw new Error("Cash register not found");

    // Obtener facturas pagadas de esa caja
    const invoices = await prisma.invoice.findMany({
        where: {
            cashRegisterId,
            status: "PAID", // Usa string literal para evitar imports
        },
        select: {
            id: true,
            subtotal: true,
            itbis: true,
            paymentMethod: true,
        },
    });

    let totalCash = 0;
    let totalBankTransfer = 0;
    let totalCreditCard = 0;
    let totalCheck = 0;
    let totalOther = 0;

    for (const invoice of invoices) {
        const amount = invoice.subtotal + invoice.itbis;

        switch (invoice.paymentMethod) {
            case "cash":
                totalCash += amount;
                break;
            case "bank_transfer":
                totalBankTransfer += amount;
                break;
            case "credit_card":
                totalCreditCard += amount;
                break;
            case "check":
                totalCheck += amount;
                break;
            default:
                totalOther += amount;
                break;
        }
    }

    const total =
        totalCash +
        totalBankTransfer +
        totalCreditCard +
        totalCheck +
        totalOther;

    return {
        totalCash,
        totalBankTransfer,
        totalCreditCard,
        totalCheck,
        totalOther,
        total,
    };
}


async function main() {
    console.log("🔹 Iniciando recálculo de cierres...\n");

    const closures = await prisma.cashRegisterClosure.findMany({
        orderBy: { createdAt: "asc" },
    });

    console.log(`📌 Cierres encontrados: ${closures.length}\n`);

    let updatedCount = 0;

    for (const closure of closures) {
        try {
            console.log(`Procesando cierre ${closure.id}...`);

            const summary = await getCashRegisterInvoicesSummary(
                prisma,
                closure.cashRegisterId
            );

            const {
                totalCash: expectedTotalCashRaw,
                totalBankTransfer: expectedTotalTransfer,
                totalCreditCard: expectedTotalCard,
                totalCheck: expectedTotalCheck,
            } = summary;

            const expectedTotalCash =
                closure.initialBalance +
                expectedTotalCashRaw -
                closure.totalExpense;

            await prisma.cashRegisterClosure.update({
                where: { id: closure.id },
                data: {
                    expectedTotalCash,
                    expectedTotalCard,
                    expectedTotalCheck,
                    expectedTotalTransfer,
                },
            });

            updatedCount++;
            console.log(`✔ Recalculado\n`);
        } catch (err) {
            console.log(
                `❌ Error recalculando cierre ${closure.id}: ${err.message}`
            );
        }
    }

    console.log("-----------------------------------");
    console.log(`✔ Cierres recalculados: ${updatedCount}`);
    console.log(
        `❌ Fallos: ${closures.length - updatedCount} (ver logs arriba)`
    );
    console.log("-----------------------------------");

    await prisma.$disconnect();
}

main()
    .catch(async (err) => {
        console.error("❌ Error fatal:", err);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
