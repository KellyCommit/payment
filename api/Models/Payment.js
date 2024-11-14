const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const paymentSchema = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    amount:{type:Number,required:true},
    apiKey:{type:String},
    paymentStatus: {type: String,enum: ['pending', 'confirmed', 'failed'],default: 'pending',},
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;