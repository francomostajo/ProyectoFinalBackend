export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/products');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: Se requiere rol premium' });
    }
};


export const isAdminOrPremium = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next(); // Si es admin o premium, permitir el acceso
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
};