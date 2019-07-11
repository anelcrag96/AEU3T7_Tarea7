const mongoose=require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
      required: true,
      type: String
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
    nocontrol:{
      type:String,
      required:true
    },
    carrera:{
      type:String,
      required:true
    },
    prestamos:[{
        _id:{type: mongoose.Schema.Types.ObjectId, ref: 'Libro'},
        nombre:{
            type:String
        },
        fechainicio:{
          type: Date
        },
        fechafin:{
          type:Date
        },
        adeudo:{
          type:Number,
          default:0
        }
    }],
  });
  
  const userModel = mongoose.model('User', userSchema, 'users');
  
  module.exports = userModel;