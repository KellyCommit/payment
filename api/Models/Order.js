const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  transactionReference: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountDurationSeconds: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
