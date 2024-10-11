const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/auth'); // Import your middleware

router.get('/', authMiddleware, async (req, res) => {
    try {
        const id = req.userId;

        // Validate the userId format if necessary
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Find the profile associated with the userId
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // if user is found, check if profile is found

        console.log("reac");

        res.status(200).json(user);
        
        
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ message: 'Server error while retrieving user' });
    }
});


module.exports = router;
