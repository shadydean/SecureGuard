const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    active:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        required:true,
        default:'user',
        enum:['user','admin'],
    }
})

const User = mongoose.model('User',userSchema)

module.exports = User;