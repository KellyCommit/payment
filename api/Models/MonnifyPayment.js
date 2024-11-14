const mongoose = require('mongoose');

const MonnifyPaymentSchema = new mongoose.Schema({
  transactionID: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], required: true },
  amount: { type: Number, required: true },
  bankCode: { type: String, required: true },
  paymentReference:{type: String, required: true},
  date: { type: Date, default: Date.now },
});

const MonnifyPayment = mongoose.model('MonnifyPayment', MonnifyPaymentSchema);
module.exports = MonnifyPayment;
