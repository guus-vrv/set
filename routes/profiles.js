const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // for user authentication and generating tokens
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs'); // hashing passwords
const User = require('../models/User'); // Import User model
const Buyer = require('../models/Buyer'); // Import Buyer model
const Seller = require('../models/Seller'); // Import Seller model
const authMiddleware = require('../middleware/auth'); // Import your middleware
const { check, validationResult } = require('express-validator');


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

        // Create a new Profile instance
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating profile' });
    }
});

router.get('/email', authMiddleware, async (req, res) => {
  const id = req.userId;
  try
  {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, name: user.name, role: user.role });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
})

router.get('/my-clients', authMiddleware, async (req, res) => {
    const id = req.userId;
    const role = req.query.role;
    const filters = req.query;
    let profiles = null;

    try {
        // Fetch user IDs for the current 

        const users = await User.find({ brokerId: id, role: role}).select('_id');

        let profileQuery = {
            user: { $in: users }, // Only fetch profiles for these users
        };
        
        // Apply buyer filters if role is 'buyer'
        if (role === 'buyer') {
            if (filters.capital) {
                profileQuery.capital = { $gte: filters.capital[0] };
            }
            if (filters.accessToFinance) {
                profileQuery.accessToFinance = { $in: filters.accessToFinance };
            }
            if (filters.timeframe) {
                profileQuery.timeframe = { $in: filters.timeframe };
            }
            if (filters.vision) {
                profileQuery.vision = { $gte: filters.vision[0] };
            }

            profiles = await Buyer.find(profileQuery);
        }

        if (role === 'seller') {
          if (filters.annualRevenue) {
              profileQuery.annualRevenue = { $gte: filters.annualRevenue[0] };
          }
          if (filters.valuation) {
              profileQuery.valuation = { $gte: filters.valuation[0] };
          }
          if (filters.industryFocus) {
              profileQuery.industry = { $in: filters.industryFocus };
          }
          if (filters.location) {
              profileQuery.location = { $in: filters.location };
          }
          if (filters.assets) {
              profileQuery.assets = { $gte: filters.assets[0] };
          }
          if (filters.liabilities) {
              profileQuery.liabilities = { $gte: filters.liabilities[0] };
          }
          if (filters.typeOfSale) {
              profileQuery.typeOfSale = { $in: filters.typeOfSale };
          }
          if (filters.companySize) {
              profileQuery.companySize = { $gte: filters.companySize[0] };
          }
          if (filters.employees) {
              profileQuery.employees = { $gte: filters.employees[0] };
          }
          if (filters.annualTurnover) {
              profileQuery.annualTurnover = { $gte: filters.annualTurnover[0] };
          }
          if (filters.balanceSheetTotal) {
              profileQuery.balanceSheetTotal = { $gte: filters.balanceSheetTotal[0] };
          }
          if (filters.keyProductService) {
              profileQuery.keyProductsServices = { $gte: filters.keyProductService[0] };
          }

          profiles = await Seller.find(profileQuery);
      }

        const names = await User.find({ _id: profileQuery.user}).select('name');

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

        let user = await User.findOne({ _id: id });

        let profile = null;

        if (user.role === 'buyer')
        {
          profile = await Buyer.findOne({ user: id }).populate('user'); // Populates the user field if needed
        }
        else if (user.role === 'seller')
        {
          profile = await Seller.findOne({ user: id }).populate('user'); // Populates the user field if needed
        }

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

router.put('/update-email', authMiddleware,
    [
      check('email', 'Please include a valid email').isEmail(),
    ],
    async (req, res) => {
      const { email } = req.body;
      const userId = req.userId; // Assuming authMiddleware sets req.userId
  
      // Validate input fields
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid email', errors: errors.array() });
      } 
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.email = email;
      await user.save();
  
      return res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
      console.error('Error updating email:', error);
      res.status(500).json({ message: 'Failed to update email' });
    }
  });

// Update password route
router.put('/update-password', authMiddleware,
    [
      check('oldPassword', 'Current password is required').not().isEmpty(),
      check('newPassword', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    ],
    async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      const userId = req.userId; // Assuming authMiddleware sets req.userId
  
      // Validate input fields
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long', errors: errors.array() });
    }
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the old password is correct
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
  
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Failed to update password' });
    }
  });

// PUT endpoint to update profile data based on userId
router.put('/', authMiddleware, async (req, res) => {
    try {

        // Extract the new profile data from the request body
        const updatedData = req.body;

        let user = await User.findOne({ _id: req.userId });

        let updatedProfile = null;

        console.log('Updated data', updatedData);

        if (user.role === 'buyer')
        {
          updatedProfile = await Buyer.findOneAndUpdate(
            { user: req.userId },            // Find the profile based on the userId
            { $set: updatedData },        // Use $set to update fields with new data
            { new: true, runValidators: true } // Return the updated document and apply validation
          );
        }
        else if (user.role === 'seller')
        {
          updatedProfile = await Seller.findOneAndUpdate(
            { user: req.userId },            // Find the profile based on the userId
            { $set: updatedData },        // Use $set to update fields with new data
            { new: true, runValidators: true } // Return the updated document and apply validation
          );
        }
        else
        {
          res.status(401).json({ message: 'Broker not allowed to access page' });
        }

        // Find the profile by userId and update it with new data
        
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
