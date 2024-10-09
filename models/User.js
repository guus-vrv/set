const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['broker', 'buyer', 'seller'], required: true }, // Role can be broker, buyer, or seller
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
