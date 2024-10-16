const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    annualRevenue: mongoose.Types.Decimal128,  
    valuation: mongoose.Types.Decimal128,  
    industry: String,
    location: String,
    assets: mongoose.Types.Decimal128,  
    liabilities: mongoose.Types.Decimal128,  
    typeOfSale: String,
    companySize: Number,
    employees: Number,
    annualTurnover: mongoose.Types.Decimal128, 
    balanceSheetTotal: mongoose.Types.Decimal128, 
    keyProductsServices: String
});

sellerSchema.set('toJSON', {
    transform: (doc, ret) => {
        // Loop through all Decimal128 fields and convert them to numbers
        const decimalFields = [
            'annualRevenue',
            'valuation',
            'assets',
            'liabilities',
            'annualTurnover',
            'balanceSheetTotal'
        ];

        decimalFields.forEach(field => {
            if (ret[field]) {
                // Convert Decimal128 to a plain number
                ret[field] = parseFloat(ret[field].toString());
            }
        });

        return ret;
    }
});

// Create a model
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
