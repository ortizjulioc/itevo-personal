import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const databaseUrlString = process.env.DATABASE_URL;
if (!databaseUrlString) {
    throw new Error('❌ DATABASE_URL no está definido en las variables de entorno');
}

const dbUrl = new URL(databaseUrlString);

const prismaClientSingleton = () => {
    const adapter = new PrismaMariaDb({
        host: dbUrl.hostname,
        port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        connectionLimit: 5,
    });

    return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const Prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { Prisma };
export default Prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = Prisma;
