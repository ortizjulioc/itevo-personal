'use server';

import { createUser, findUserById, updateUserById, deleteUserById } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const usernameRegex = /^(?!.*[_.]{2})[a-zA-Z0-9._]{3,16}(?<![_.])$/;
const userValidationSchema = z.object({
    name: z.string({ required_error: 'El nombre es requerido' }),
    lastName: z.string({ required_error: 'El apellido es requerido' }),
    username: z.string({ required_error: 'El nombre de usuario es requerido' })
        .regex(usernameRegex, { message: 'El nombre de usuario no es válido' }),
    email: z.string({ required_error: 'El email es requerido' })
        .email('Formato de email incorrecto'),
    phone: z.string(),
    password: z.string({ required_error: 'La contraseña es requerida' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string({ required_error: 'Debes confirmar la contraseña' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export async function createUserAction(prevState: any, data: FormData) {
    try {
        const userToCreate = {
            name: data.get('name') || '',
            lastName: data.get('lastName') || '',
            username: data.get('username') || '',
            email: data.get('email') || '',
            password: data.get('password') || '',
            phone: data.get('phone') || '',
            confirmPassword: data.get('confirmPassword') || '',
        };
        // Validar campos requeridos con yup
        const validatedFields = userValidationSchema.safeParse(userToCreate);

        console.log(validatedFields?.error?.format());

        if (!validatedFields.success) {
            return { code: 'E_MISSING_FIELDS', message: validatedFields.error.message, error: validatedFields.error.format() };
        }

        // Crear el usuario utilizando el servicio
        const { confirmPassword, ...userWithoutConfirmPassword } = userToCreate;
        await createUser(userWithoutConfirmPassword);
    } catch (error) {
        return { code: 'E_SERVER_ERROR', message: 'Error creando el usuario', error };
    }

    revalidatePath('/users');
    redirect('/users');
}
// Actualizar usuario por ID
export async function updateUserAction(id: string, body: any) {
    try {
        // Validar campos requeridos
        if (!body.name || !body.lastName || !body.username || !body.email) {
            throw new Error('Campos faltantes: name, lastName, username, email son requeridos');
        }

        const user = await findUserById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const updatedUser = await updateUserById(id, body);
        return updatedUser;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error obteniendo el usuario: ${error.message}`);
        } else {
            throw new Error('Error desconocido obteniendo el usuario');
        }
    }
}

// Eliminar usuario por ID (soft delete)
export async function deleteUserAction(id: string) {
    try {
        const user = await findUserById(id);
        if (!user) {
            return { code: 'E_USER_NOT_FOUND', message: 'Usuario no encontrado' };
        }

        await deleteUserById(id);
        revalidatePath('/users');
        return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
        return { code: 'E_SERVER_ERROR', message: 'Error eliminando el usuario', error };
    }
}
