const mongoose=require('mongoose');

let loanSchema = new mongoose.Schema({
    idBook:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book'
    },
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startDate:{
        type: Date,
        required: true
    },
    expirationDate:{
        type: Date,
        required: true
    },
    debitDays:{
        type: Number,
        required: true
    }
  });
  
  const loanModel = mongoose.model('Loan', loanSchema, 'loans');
  
  module.exports = loanModel;