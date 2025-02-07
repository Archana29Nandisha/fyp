import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: `No Token Authorization Denied, no token` });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        } catch (err) {
            return res.status(401).json({ message: `Token is not valid` });
        }
    } else {
        return res.status(401).json({ message: `No Token Authorization Denied` });
    }
};

// Export as ES Module
export default verifyToken;
