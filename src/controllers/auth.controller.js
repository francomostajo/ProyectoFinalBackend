import {
    register,
    authenticateUser,
    requestPasswordReset,
    resetPasswordService,
    getAllUsers,
    modifyUser
} from '../service/auth.service.js';
import UserDTO from '../dto/user.dto.js';
import passport from 'passport';
import createError from 'http-errors';

export const registerUser = async (req, res, next) => {
    try {
        const user = await register(req.body);
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error.message); // Log detallado del error
        next(createError(500, 'USER_REGISTER_ERROR'));
    }
};

export const loginUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            console.error('Error during login authentication:', err);
            return next(createError(500, 'USER_LOGIN_ERROR'));
        }
        if (!user) {
            console.log('User not found:', info);
            req.flash('error', 'Usuario no registrado. Por favor, regístrese.');
            return res.render('login', { message: req.flash('error') });
        }

        req.logIn(user, async (err) => {  // Make this callback async
            if (err) {
                console.error('Error during user login:', err);
                return next(createError(500, 'USER_LOGIN_ERROR'));
            }
            try {
                user.lastActive = new Date();
                await user.save();  // Now you can safely use await
                return res.redirect('/products');
            } catch (saveError) {
                console.error('Error saving user:', saveError);
                return next(createError(500, 'USER_SAVE_ERROR'));
            }
        });
    })(req, res, next);
};
export const logoutUser = (req, res, next) => {
    try {
        req.logout();
        res.redirect('/login');
    } catch (error) {
        next(createError(500, 'USER_LOGOUT_ERROR'));
    }
};

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
};

export const getCurrentUser = (req, res, next) => {
    try {
        console.log("Current User:", req.user);  // Debugging information
        const user = req.user;
        const userDTO = new UserDTO(user);
        res.json(userDTO);
    } catch (error) {
        console.error("Error fetching current user data:", error);  // More detailed error log
        next(createError(500, 'USER_FETCH_ERROR'));
    }
};

export const requestPasswordResetController = async (req, res, next) => {
    try {
        await requestPasswordReset(req.body.email, req.headers.host);
        req.flash('info', 'Se ha enviado un correo electrónico con más instrucciones.');
        res.redirect('/request-password-reset');
    } catch (error) {
        console.error('Error al solicitar el restablecimiento de contraseña:', error.message);
        next(createError(500, 'REQUEST_PASSWORD_RESET_ERROR'));
    }
};

export const renderResetPasswordPage = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'El token de restablecimiento de contraseña es inválido o ha expirado.');
            return res.redirect('/request-password-reset');
        }

        res.render('reset-password', { token });
    } catch (error) {
        console.error('Error al renderizar la página de restablecimiento de contraseña:', error.message);
        next(createError(500, 'RENDER_RESET_PASSWORD_PAGE_ERROR'));
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash('error', 'Las contraseñas no coinciden.');
            return res.redirect(`/reset-password/${token}`);
        }

        await resetPasswordService(token, password);

        req.flash('success', 'Tu contraseña ha sido restablecida con éxito.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error.message);
        next(createError(500, 'RESET_PASSWORD_ERROR'));
    }
};

export const fetchAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        // Solo devolver datos relevantes
        const userPayload = users.map(user => ({
            id: user._id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
        }));
        res.send({ result: "success", payload: userPayload });
    } catch (error) {
        next(createError(500, 'USERS_FETCH_ERROR'));
    }
};

export const deleteInactiveUsers = async (req, res, next) => {
    try {
        const deletedUsers = await removeInactiveUsers();
        deletedUsers.forEach(user => {
            sendAccountDeletionEmail(user.email);
        });
        res.send({ result: "success", message: 'Usuarios inactivos eliminados.' });
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
    const allowedRoles = ['admin', 'user'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Rol no permitido' });
    }

    try {
        const updatedUser = await modifyUser(uid, { role });
        res.status(200).json({ result: 'success', payload: updatedUser });
    } catch (error) {
        console.error('Error al modificar el rol:', error); // Añadir logs para verificar el error
        next(createError(500, 'USER_MODIFY_ROLE_ERROR'));
    }
};