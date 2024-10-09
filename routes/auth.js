const express = require('express'); // web framework for building APIs
const bcrypt = require('bcryptjs'); // hashing passwords
const jwt = require('jsonwebtoken'); // for user authentication and generating tokens
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // importing user from MongoDB

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (Broker, Buyer, or Seller)
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required and should be one of broker, buyer, seller').isIn(['broker', 'buyer', 'seller']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create a new user instance
      user = new User({ name, email, password, role });

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create and return a JWT token
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        'yourSecretKey', // Replace with a secure key in production
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'No user with this email' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect password' });
    }

    // Generate JWT tokeni
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    
    // Send token as response
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
