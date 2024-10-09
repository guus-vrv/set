// routes/data.js
const express = require('express');
const CompanyData = require('../models/CompanyData');
const router = express.Router();

// @route   POST /api/data
// @desc    Submit M&A data
// @access  Private (ensure user is authenticated)
router.post('/', async (req, res) => {
  try {
    const newData = new CompanyData(req.body);
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
