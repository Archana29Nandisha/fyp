const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access Denied!` });
        }
        next();
    };
};

// Export as ES Module
export default authorizeRole;
