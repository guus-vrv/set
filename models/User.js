const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['broker', 'buyer', 'seller'], required: true }, // Role can be broker, buyer, or seller
  brokerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to Broker
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
