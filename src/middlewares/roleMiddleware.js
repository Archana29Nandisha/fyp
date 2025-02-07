const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log('Headers:', req.headers);

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Accesses Denied!` });
        }
        next();
    };
};

// Export as ES Module
export default authorizeRole;
