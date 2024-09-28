import { Router } from "express";
import {
    fetchAllUsers,
    createUser,
    fetchUserById,
    updateUser,
    deleteUser,
    modifyUserRole,
    deleteInactiveUsers
} from '../controllers/user.controller.js';
import { 
    isAuthenticated,
    isAdmin
 } from '../middleware/auth.js';

const router = Router();

router.get('/',isAuthenticated, isAdmin, fetchAllUsers);
router.post('/',isAuthenticated, isAdmin, createUser);
router.get('/:id',isAuthenticated, isAdmin, fetchUserById);
router.put('/:uid',isAuthenticated, isAdmin, updateUser);
router.delete('/:uid',isAuthenticated, isAdmin, deleteUser);
router.put('/:uid/role',isAuthenticated, isAdmin, modifyUserRole);
router.delete('/inactive', deleteInactiveUsers, isAdmin);

export default router;