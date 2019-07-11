const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    controlNumber:{
      type: String,
      required: true
    },
    career:{
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      match: [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true
    },
    loan:[{
      idBook: String, //book:{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
      nameBook: String,
      startDate: Date,
      expirationDate: Date,
      debitDays: Number
    }]
  });
  
  const userModel = mongoose.model('User', userSchema, 'users');
  
  module.exports = userModel;