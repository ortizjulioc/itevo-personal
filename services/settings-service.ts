import 'server-only';
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

export const getSettings = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const settings = await Prisma.setting.findMany({
        orderBy: [
            { companyName: 'asc' },
        ],
        select: {
            id: true,
            rnc: true,
            companyName: true,
            address: true,
            email: true,
            logo: true,
            phone: true,
        },
        where: {
            deleted: false,
        },
        skip: skip,
        take: top,
    });

    return {settings};
};

export const createSetting = async (data: any) => {
    const setting = await Prisma.setting.create({ data: data });
    return setting;
};


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
