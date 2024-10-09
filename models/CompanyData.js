// models/M&AData.js
const mongoose = require('mongoose');

const CompanyData = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  companySize: { type: String, required: true },
  yearFounded: { type: Number, required: true },
  annualRevenue: { type: Number, required: true },
  ebitda: { type: Number, required: true },
  netIncome: { type: Number, required: true },
  assets: { type: Number, required: true },
  liabilities: { type: Number, required: true },
  transactionType: { type: String, required: true },
  askingPrice: { type: Number, required: true },
  desiredTerms: { type: String, required: true },
  confidentialityAgreement: { type: String, required: true },
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
});

module.exports = mongoose.model('CompanyData', CompanyData);
