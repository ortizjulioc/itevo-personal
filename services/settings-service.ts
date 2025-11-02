import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes, } from '@prisma/client';
const bcrypt = require('bcrypt');

export const getSettings = async (
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
) => {
    return await prisma.setting.findFirst();
};

export const createSetting = async (data: any) => {
    // Verificar si ya existe un setting
    const existingSetting = await Prisma.setting.findFirst({
        where: { deleted: false },
    });

    // Si ya existe un setting, lo actualizamos
    if (existingSetting) {
        return Prisma.setting.update({
            where: { id: existingSetting.id },
            data: {
                ...data,
                defaultPassword: data.defaultPassword ? bcrypt.hashSync(data.defaultPassword, 10) : existingSetting.defaultPassword,
            },
        });
    }

    // Si no existe, creamos uno nuevo
    return Prisma.setting.create({
        data: {
            ...data,
            defaultPassword: data.defaultPassword ? bcrypt.hashSync(data.defaultPassword, 10) : undefined,
        },
    });
};

export const changeLogo = async (logo: string) => {
    // Verificar si ya existe un setting
    const existingSetting = await Prisma.setting.findFirst({
        where: { deleted: false },
    });

    if (existingSetting) {
        // Actualizar el logo del setting existente
        return Prisma.setting.update({
            where: { id: existingSetting.id },
            data: { logo: logo },
        });
    } else {
        throw new Error('No se encontró una configuracion existente para actualizar el logo.');
    }
}


// Actualizar setting por ID
export const updateSettingById = async (id: string, data: any) => {
    // Actualizar el campo defaultPassword si está presente
    if (data.defaultPassword) {
        const saltRounds = 10;
        data.defaultPassword = bcrypt.hashSync(data.defaultPassword, saltRounds);
    } else {
        delete data.defaultPassword;
    }

    return Prisma.setting.update({
        where: { id },
        data: data,
    });
};
