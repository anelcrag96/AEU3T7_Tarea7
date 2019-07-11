const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    autor:{
        type:String,
        required:true
    },
    editorial:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    edicion:{
        type:String,
        required:true},
    cantidad:{
        type:Number,
        required:true
    },
    disponibilidad:{
        type:Boolean,
        required:true
    }
});
  
const userModel = mongoose.model('Libro', userSchema, 'books');

module.exports = userModel;