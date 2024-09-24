import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    registerUser,
    modifyUser,
    removeUser
} from '../service/users.service.js';
import createError from 'http-errors';

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