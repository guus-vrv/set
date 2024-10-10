// middlewares/roleCheck.js
const roleCheck = (roles) => (req, res, next) => {
    const { user } = req;

    // Check if the user exists and has a role in the allowed roles array
    if (user && roles.includes(user.role)) {
        return next(); // User has the required role, proceed
    }

    // Return unauthorized error if user role is not allowed
    res.status(403).json({ message: 'Access forbidden: You do not have the required permissions.' });
};

module.exports = roleCheck;
