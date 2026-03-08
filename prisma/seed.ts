import { PrismaClient } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const databaseUrlString = process.env.DATABASE_URL;
if (!databaseUrlString) {
  throw new Error('❌ DATABASE_URL no está definido en las variables de entorno');
}

const dbUrl = new URL(databaseUrlString);

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // Se remueve el "/" inicial del nombre de la base de datos
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Ubicar y leer el archivo settings.json en la raíz del proyecto
  const settingsPath = path.join(__dirname, '../settings.json');
  const fileData = fs.readFileSync(settingsPath, 'utf-8');
  const data = JSON.parse(fileData);

  console.log('🌱 Iniciando la ejecución del seed...');

  // 1. Crear o actualizar la Empresa (Settings)
  const { company } = data;
  await prisma.setting.upsert({
    where: { rnc: company.rnc },
    update: {
      companyName: company.companyName,
      address: company.address,
      phone: company.phone,
      email: company.email,
      logo: company.logo,
      defaultPassword: company.defaultPassword,
    },
    create: {
      rnc: company.rnc,
      companyName: company.companyName,
      address: company.address,
      phone: company.phone,
      email: company.email,
      logo: company.logo,
      defaultPassword: company.defaultPassword,
    },
  });
  console.log('✅ Configuraciones (Settings) procesadas.');

  // 2. Crear o actualizar los Roles
  for (const role of data.roles) {
    await prisma.role.upsert({
      where: { normalizedName: role.normalizedName },
      update: { name: role.name },
      create: {
        name: role.name,
        normalizedName: role.normalizedName,
      },
    });
  }
  console.log('✅ Roles procesados.');

  // 3. Crear o actualizar las Sucursales (Branches)
  // Como Branch no tiene un campo único aparte del ID en tu esquema, 
  // buscamos primero por el nombre para evitar duplicados.
  for (const branch of data.branches) {
    const existingBranch = await prisma.branch.findFirst({
      where: { name: branch.name },
    });

    if (existingBranch) {
      await prisma.branch.update({
        where: { id: existingBranch.id },
        data: {
          address: branch.address,
          phone: branch.phone,
        },
      });
    } else {
      await prisma.branch.create({
        data: {
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
        },
      });
    }
  }
  console.log('✅ Sucursales procesadas.');

  // 4. Crear Usuarios y asignar relaciones (UserRoleBranch)
  for (const userData of data.users) {
    // Upsert del usuario principal
    const user = await prisma.user.upsert({
      where: { username: userData.username },
      update: {
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        phone: userData.phone,
        password: userData.password, // Considera usar bcrypt para hashear esto en un entorno real
      },
      create: {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        phone: userData.phone,
        password: userData.password,
      },
    });

    // Buscar las referencias del rol y la sucursal para la tabla relacional
    const roleRecord = await prisma.role.findUnique({
      where: { normalizedName: userData.role },
    });

    const branchRecord = await prisma.branch.findFirst({
      where: { name: userData.branch },
    });

    if (roleRecord && branchRecord) {
      // Verificar si la relación ya existe para no duplicar en la tabla pivote
      const existingRelation = await prisma.userRoleBranch.findFirst({
        where: {
          userId: user.id,
          roleId: roleRecord.id,
          branchId: branchRecord.id,
        },
      });

      if (!existingRelation) {
        await prisma.userRoleBranch.create({
          data: {
            userId: user.id,
            roleId: roleRecord.id,
            branchId: branchRecord.id,
          },
        });
      }
    }
  }
  console.log('✅ Usuarios y permisos procesados.');
  console.log('🎉 Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });