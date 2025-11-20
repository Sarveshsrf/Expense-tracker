const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income','expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Uncategorized' },
  date: { type: Date, required: true },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
