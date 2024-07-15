const jwt = require('jsonwebtoken');

require('dotenv').config()

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PVT_KEY);
        req.user = decoded.user;
        req.userId = decoded.user.id;
        req.isActive = decoded.user.active;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;