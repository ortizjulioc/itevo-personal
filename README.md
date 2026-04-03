# Itevo Core

Proyecto principal para la plataforma Itevo, desarrollado utilizando **Next.js**. Este repositorio contiene el código fuente de la aplicación orientada al manejo de procesos, facturación, y administración del sistema.

## 🚀 Acerca del Proyecto

Itevo Core es un sistema de gestión estructurado con funcionalidades basadas en roles (dashboard personalizado para administradores, cajeros, asistentes, etc.), administración de usuarios, facturación, generación de comprobantes (NCFs) y el control de entidades educativas/operativas. 

### Tecnologías Principales
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Base de Datos / ORM:** [Prisma](https://www.prisma.io/) (con MariaDB)
- **Autenticación:** [NextAuth](https://next-auth.js.org/)
- **Estilos:** Tailwind CSS, Emotion, framer-motion y Headless UI
- **Estado Global:** Redux Toolkit

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local antes de iniciar:
- [Node.js](https://nodejs.org/) (versión 18+ recomendada)
- Un gestor de paquetes (`npm`, `yarn` o `pnpm`)
- Una base de datos compatible (Ej. MariaDB / MySQL) corriendo y accesible.

## ⚙️ Variables de Entorno

Para que la aplicación funcione correctamente, es necesario configurar las variables de entorno. Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente estructura:

```env
DATABASE_URL=""
NEXTAUTH_URL=""
NEXTAUTH_SECRET=""
PORT=""
APP_NAME=""
NEXTAUTH_COOKIE_NAME=""
```

**Descripción de las variables:**
- `DATABASE_URL`: Cadena de conexión a tu base de datos (Ej: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`).
- `NEXTAUTH_URL`: URL base de la aplicación (Ej: para desarrollo local `http://localhost:3000`).
- `NEXTAUTH_SECRET`: Cadena secreta para encriptar los tokens de NextAuth (puedes generar una usando `openssl rand -base64 32`).
- `PORT`: Puerto en el que correrá la aplicación.
- `APP_NAME`: Nombre representativo de la aplicación.
- `NEXTAUTH_COOKIE_NAME`: Nombre personalizado para las cookies de sesión, útil para evitar conflictos de cookies si tienes proyectos similares.

## 🛠️ Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo:

1. **Instala las dependencias** en la raíz del repositorio:
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

2. **Configura tu base de datos**:
   Asegúrate de que la variable `DATABASE_URL` en tu archivo `.env` sea correcta y luego sincroniza el esquema de Prisma y genera el cliente:
   ```bash
   npm run prisma:sync
   ```
   *(Opcional)* Si hay datos semilla (seeders) iniciales necesarios, puedes correrlos con:
   ```bash
   npm run prisma:seed
   # o
   npm run seed
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

4. **Abre la aplicación:**
   Navega a la url configurada (por defecto [http://localhost:3000](http://localhost:3000)) en tu navegador para ver la interfaz.

## 📜 Scripts Disponibles en package.json

A continuación los comandos principales que puedes ejecutar:

- `npm run dev`: Inicia el servidor en modo desarrollo.
- `npm run build`: Construye y compila el proyecto completo preparándolo para producción.
- `npm run start`: Inicia el proyecto compilado para ambientes de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para buscar errores de sintaxis en el código.
- `npm run prisma:sync`: Ejecuta `db push` y `generate` mediante Prisma para tener la DB actualizada.
- `npm run prisma:seed` o `npm run seed`: Inserta datos iniciales a tu base de datos utilizando tus configuraciones de semilla.
