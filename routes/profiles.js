const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User'); // Import User model
const authMiddleware = require('../middleware/auth'); // Import your middleware

// POST endpoint to save profile data
router.post('/', async (req, res) => {
    try {
        const id = req.userId;
        const { ...formData } = req.body; // Get username from request body

        // Find the user by username (or any other field)
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profile = await Profile.findOne({ user: id }).populate('user'); // Populates the user field if needed

        if (!profile) {
            const newProfile = new Profile({
                user: id, // Store the user's ObjectId
                ...formData // Spread the remaining form data into the profile
            });
    
            await newProfile.save();
            res.status(201).json({ 
                message: 'Profile created successfully!',
                profile: newProfile // Return the created profile if needed
            });
        }
        else
        {
            return res.status(400).json({ message: 'Profile for this user already exists' });
        }

        // Create a new Profile instance
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile' });
    }
});

router.get('/my-clients', authMiddleware, async (req, res) => {


    const { industry = [], location = [] } = req.query;

    const id = req.userId;

    try {

    const query = { brokerId: id};

    if (industry.length > 0) {
        query.industry = { $in: industry }; // Match any of the industries selected
    }
    if (location.length > 0) {
        query.location = { $in: location }; // Match any of the locations selected
    }

    console.log('Query', query);

    // Assuming req.user is populated with the logged-in broker's info
    const profiles = await Profile.find({
        user: { $in: await User.find(query).select('_id') }
    });

    res.status(200).json(profiles);
        
    } catch (error) {
        console.error('Error fetching client profiles:', error);
        res.status(500).json({ message: 'Error fetching client profiles' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const id = req.userId;

        // Validate the userId format if necessary
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Find the profile associated with the userId
        const profile = await Profile.findOne({ user: id }).populate('user'); // Populates the user field if needed

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found for the given userId' });
        }

        // Send the profile data as a response
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).json({ message: 'Server error while retrieving profile' });
    }
});

// PUT endpoint to update profile data based on userId
router.put('/', authMiddleware, async (req, res) => {
    try {
        const id = req.userId;

        // Extract the new profile data from the request body
        const updatedData = req.body;

        // Find the profile by userId and update it with new data
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: id },            // Find the profile based on the userId
            { $set: updatedData },        // Use $set to update fields with new data
            { new: true, runValidators: true } // Return the updated document and apply validation
        );

        // If no profile is found, return a 404 error
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found for the given userId' });
        }

        // Respond with the updated profile data
        res.status(200).json({ 
            message: 'Profile updated successfully!',
            profile: updatedProfile 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// Route to check if a user has a profile
router.get('/check', authMiddleware, async (req, res) => {
    try {
        const id = req.userId;
        
        const profile = await Profile.findOne({ user: id }); // Check for profile based on userId
        if (profile) {
            return res.status(200).json({ hasProfile: true });
        }
        return res.status(200).json({ hasProfile: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking profile' });
    }
});

module.exports = router;
