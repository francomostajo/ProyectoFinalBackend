import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserModel from '../dao/models/user.model.js';
import { sendPasswordResetEmail, sendAccountDeletionEmail } from './email.service.js';
import {
    findUserByEmail,
    createUser
} from '../dao/data/userDao.js';

export const register = async (userData) => {
    const { first_name, last_name, email, age, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('El usuario ya existe');
    }

    // Crear el nuevo usuario
    const user = new UserModel({ first_name, last_name, email, age, password });

    // Asignar rol basado en el correo y la contraseña
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        user.role = 'admin';
    } else {
        user.role = 'user';
    }

    // Guardar el nuevo usuario en la base de datos
    await createUser(user);
    return user;
};

export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Contraseña incorrecta');
    }
       // Actualizar el campo lastActive o lastConnection
       user.lastActive = Date.now(); // o `lastConnection`
       await user.save();
    return user;
};

export const requestPasswordReset = async (email, host) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error('No se encontró ninguna cuenta con ese correo electrónico.');
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `http://${host}/reset-password/${token}`;
    await sendPasswordResetEmail(user, resetUrl);
};

export const resetPasswordService = async (token, newPassword) => {
    const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('El token de restablecimiento de contraseña es inválido o ha expirado.');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new Error('No puedes usar la misma contraseña anterior.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
};

export const getAllUsers = async () => {
    return await UserModel.find({}, 'first_name last_name email role'); // Solo devuelve campos necesarios
};

export const deleteInactiveUsers = async (req, res, next) => {
    try {
        const deletedUsers = await removeInactiveUsers(); // Assuming this function is correctly defined in the service
        deletedUsers.forEach(user => {
            sendAccountDeletionEmail(user.email);
        });
        res.send({ result: "success", message: 'Usuarios inactivos eliminados.' });
    } catch (error) {
        next(createError(500, 'USER_REMOVE_ERROR'));
    }
};


// Servicio para modificar el rol de un usuario
export const modifyUser = async (uid, updateData) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(uid, updateData, { new: true });
        if (!updatedUser) {
            throw new Error('Usuario no encontrado');
        }
        return updatedUser;
    } catch (error) {
        console.error('Error al modificar el usuario:', error);
        throw error;
    }
};