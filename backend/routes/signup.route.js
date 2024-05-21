const express=require('express')
const signupRoute=express.Router()

signupRoute.use(express.json())
signupRoute.use(express.urlencoded({ extended: true }))

const UserModel=require('../models/user.model')
const saveUser=require('../controllers/SignupController')

signupRoute.post('/',saveUser)
module.exports=signupRoute
