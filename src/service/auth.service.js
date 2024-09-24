import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserModel from '../dao/models/user.model.js';
import { sendPasswordResetEmail } from './email.service.js';
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