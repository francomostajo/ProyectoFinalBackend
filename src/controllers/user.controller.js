import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    registerUser,
    modifyUser,
    removeUser
} from '../service/users.service.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const fetchAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.send({ result: "success", payload: users });
    } catch (error) {
        next(createError(500, 'USERS_FETCH_ERROR'));
    }
};

export const fetchUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        res.send({ result: "success", payload: user });
    } catch (error) {
        next(createError(500, 'USER_FETCH_ERROR'));
    }
};

export const createUser = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.send({ result: "success", payload: user });
    } catch (error) {
        next(createError(500, 'USER_REGISTER_ERROR'));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await modifyUser(uid, req.body);
        res.send({ result: "success", payload: user });
    } catch (error) {
        next(createError(500, 'USER_MODIFY_ERROR'));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        await removeUser(uid);
        res.send({ result: "success" });
    } catch (error) {
        next(createError(500, 'USER_REMOVE_ERROR'));
    }
};

export const modifyUserRole = async (req, res, next) => {
    const { uid } = req.params;
    const { role } = req.body;

    // Validar si el uid es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(uid)) {
        return res.status(400).json({ error: 'ID de usuario no válido' });
    }

    // Validar si el rol es uno permitido
    const allowedRoles = ['admin', 'user','premium'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Rol no permitido' });
    }

    try {
        const updatedUser = await modifyUser(uid, { role });
        res.status(200).json({ result: 'success', payload: updatedUser });
    } catch (error) {
        console.error('Error al modificar el rol:', error);
        next(createError(500, 'USER_MODIFY_ROLE_ERROR'));
    }
};