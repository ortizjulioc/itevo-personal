import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // Use Prisma to fetch all users from the database and return them as JSON
        // Select only the id, username, email, and username fields

        const users = await Prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password: false,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Use  bcrypt to hash the password before saving it to the database

        const saltRounds = 10;
        const hash = bcrypt.hashSync(body.password, saltRounds);
        body.password = hash;

        const user = await Prisma.users.create({ data: body });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.error();
    }
}
