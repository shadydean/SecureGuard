const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

const signup = async (req,res)=> {
    const {email,password,mobilenumber} = req.body
        if(!email||!password||!mobilenumber){
            return res.status(400).send({message:'Please fill all the fields'})
        }
    try{
        let user = await User.find({email})
        if(user){
            res.status(200).send({message:"User already exists"})
        }else{
            user = new User({email,password,mobilenumber,active:true,role:'user'})
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password,salt)
            await user.save()
            res.status(201).send({message:"User created successfully"})
        }        
        }
        catch(err){
            res.status(500).send({message:"Error creating user"})
        }
}

module.exports = signup