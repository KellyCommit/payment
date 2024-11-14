const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true},
    userName:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    apiKey:{type:String,required:true,unique:true},
    referralId:{type:String},
    uniqueId:{type:String,unique:true,default:function(){return this.phone.slice(-10);}},
    balance:{type:Number,default:0},
    accountName:{type:String},
    accountNumber:{type:Number},
    bank:{type:String},
    isAdmin:{type:Boolean, default:false}
}, { timestamps: true });

// Drop the unique index on referralId
userSchema.index({ referralId: 1 }, { unique: false });
const User = mongoose.model('User', userSchema);

// Create an async function to sync indexes
async function syncIndexes() {
    await User.syncIndexes();
  }
  // Call the async function
  syncIndexes();

module.exports = User;