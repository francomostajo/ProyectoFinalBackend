import {
    findUserById,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    findAllUsers
} from '../dao/data/userDao.js';
import { sendPasswordResetEmail, sendAccountDeletionEmail } from './email.service.js'; // Importa las funciones de mailer

export const getAllUsers = async () => {
    return await findAllUsers();
};

export const getUserById = async (userId) => {
    return await findUserById(userId);
};

export const getUserByEmail = async (email) => {
    return await findUserByEmail(email);
};

export const registerUser = async (userData) => {
    return await createUser(userData);
};

export const modifyUser = async (userId, userData) => {
    return await updateUser(userId, userData);
};

// Función para restablecer contraseña
export const resetPassword = async (user, resetUrl) => {
    await sendPasswordResetEmail(user, resetUrl);  // Envía el correo de restablecimiento
    return { message: "Correo de restablecimiento enviado" };
};

// Eliminar usuario y enviar correo de notificación
export const removeUser = async (userId) => {
    const user = await findUserById(userId);
    if (user) {
        await deleteUser(userId);
        await sendAccountDeletionEmail(user.email); // Envía el correo de eliminación de cuenta
        return { message: "Usuario eliminado y correo enviado" };
    }
    throw new Error('Usuario no encontrado');
};