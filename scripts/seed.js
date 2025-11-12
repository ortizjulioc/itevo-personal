const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// 📌 Cargar el archivo settings.json
const settingsPath = path.join(__dirname, "../settings.json");
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

async function main() {
    console.log("🔹 Iniciando seed...");

    // 🔹 Crear configuración de la empresa
    let setting = await prisma.setting.findFirst();
    if (!setting) {
        setting = await prisma.setting.create({
            data: settings.company,
        });
        console.log("✅ Configuración de la empresa creada.");
    } else {
        console.log("🔸 La configuración de la empresa ya existe.");
    }

    // 🔹 Crear roles
    for (const roleData of settings.roles) {
        let role = await prisma.role.findUnique({
            where: { normalizedName: roleData.normalizedName },
        });

        if (!role) {
            await prisma.role.create({ data: roleData });
            console.log(`✅ Rol ${roleData.name} creado.`);
        } else {
            console.log(`🔸 Rol ${roleData.name} ya existe.`);
        }
    }

    // 🔹 Crear sucursales
    for (const branchData of settings.branches) {
        let branch = await prisma.branch.findFirst({
            where: { name: branchData.name },
        });

        if (!branch) {
            await prisma.branch.create({ data: branchData });
            console.log(`✅ Sucursal ${branchData.name} creada.`);
        } else {
            console.log(`🔸 Sucursal ${branchData.name} ya existe.`);
        }
    }

    // 🔹 Crear usuarios
    for (const userData of settings.users) {
        let user = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!user) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const role = await prisma.role.findUnique({
                where: { normalizedName: userData.role },
            });
            const branch = await prisma.branch.findFirst({
                where: { name: userData.branch },
            });

            if (!role || !branch) {
                console.error(
                    `❌ Error: El rol '${userData.role}' o la sucursal '${userData.branch}' no existen.`
                );
                continue;
            }

            user = await prisma.user.create({
                data: {
                    username: userData.username,
                    email: userData.email,
                    name: userData.name,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    password: hashedPassword,
                },
            });

            console.log(`✅ Usuario ${userData.username} creado.`);

            // 🔹 Asignar roles y sucursal al usuario
            // Si el usuario tiene el rol super_admin o si tiene allRoles: true, asignar todos los roles
            const shouldAssignAllRoles = userData.role === "super_admin" || userData.allRoles === true;
            
            if (shouldAssignAllRoles) {
                // Obtener todos los roles disponibles
                const allRoles = await prisma.role.findMany({
                    where: { deleted: false },
                });

                // Asignar todos los roles al usuario en la sucursal
                for (const roleToAssign of allRoles) {
                    await prisma.userRoleBranch.create({
                        data: {
                            userId: user.id,
                            roleId: roleToAssign.id,
                            branchId: branch.id,
                        },
                    });
                    console.log(`✅ Rol ${roleToAssign.name} asignado a ${userData.username} en ${userData.branch}.`);
                }
                console.log(`✅ Todos los roles asignados a ${userData.username} en ${userData.branch}.`);
            } else {
                // Asignar solo el rol especificado
                await prisma.userRoleBranch.create({
                    data: {
                        userId: user.id,
                        roleId: role.id,
                        branchId: branch.id,
                    },
                });
                console.log(`✅ Relación ${userData.username} - ${userData.role} - ${userData.branch} creada.`);
            }
        } else {
            console.log(`🔸 Usuario ${userData.username} ya existe.`);
        }
    }

    console.log("✅ Seed completado.");
}

main()
    .catch((error) => {
        console.error("❌ Error en el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
