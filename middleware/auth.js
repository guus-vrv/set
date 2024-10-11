const jwt = require('jsonwebtoken'); // for user authentication and generating tokens

const authMiddleware = (req, res, next) => {
    // extract token
    const token = req.header('Authorization');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // verify it
        const decoded = jwt.verify(token, 'your-secret-key');
        //decode user info & store data in req.user
        req.userId = decoded.id;
        console.log('Authenticated user:', req.userId); // Log the authenticated user
        next();
    } catch (err) {
        console.log('Token verification failed');
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;