const mongoose=require('mongoose');

let bookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    author:{
      type: String,
      required: true
    },
    editorial:{
      type: String,
      required: true
    },
    edition:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    available:{
        type: Boolean,
        required: true
    }
  });
  
  const bookModel = mongoose.model('Book', bookSchema, 'books');
  
  module.exports = bookModel;