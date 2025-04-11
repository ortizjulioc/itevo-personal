import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getProducts = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const products = await Prisma.product.findMany({
        orderBy: [
            { name: 'asc' },
        ],
        select: {
            id: true,
            code: true,
            name: true,
            description: true,
            cost: true,
            price: true,
            stock: true,
            createdAt: true,
            updatedAt: true,

        },
        where: {
            deleted: false,
            name: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalProducts = await Prisma.product.count({
        where: {
            deleted: false,
            name: { contains: search },
        },
    });

    return { products, totalProducts };
};

export const createProduct = async (data: any) => {
    const product = await Prisma.product.create({ data: data });
    return product;
};

export const findProductByCode= async (data: any) => {
    const courseProductExists = await Prisma.product.findUnique({
        where: { code: data.code },
    });
    return courseProductExists;
};

// Obtener product por ID
export const findProductById = async (id: string) => {

    const product = await Prisma.product.findUnique({
        where: {
            id: id,
            deleted: false,
        },
        // include: {
        //     prerequisites: {
        //         select: {
        //             prerequisite: {
        //                 select: {
        //                     id: true,
        //                 },
        //             },
        //         },
        //     },
        // },
    });

    // Devolviendo prerequisites como un arreglo de IDs

    // if (course) {
    //     course.prerequisites = course.prerequisites.map((prerequisite: any) => prerequisite.prerequisite.id);
    // }

    return product;

};

// Actualizar product por ID
export const updateProductById = async (id: string, data: any) => {

    return Prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            code: data.code,
            description: data.description,
            deleted: false,
        },
    });
};

// Eliminar product por ID (soft delete)
export const deleteProductById = async (id: string) => {
    return Prisma.product.update({
        where: { id },
        data: { deleted: true },
    });
};
