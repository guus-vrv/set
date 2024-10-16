const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    capital: mongoose.Types.Decimal128,  
    accessToFinance: {
        type: String,
        enum: ['low', 'medium', 'high'], // Enforce valid options
    },
    timeframe: {
        type: String,
        enum: ['ready', '3 months', '6 months', '12 months'], // Enforce valid options
    },
    vision: String
});

buyerSchema.set('toJSON', {
    transform: (doc, ret) => {
      // Check if capital is a Decimal128 and convert it to a number
      if (ret.capital) {
        ret.capital = parseFloat(ret.capital.toString());  // Convert to number if it's Decimal128
      }
      return ret;
    },
  });
  

// Create a model
const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
