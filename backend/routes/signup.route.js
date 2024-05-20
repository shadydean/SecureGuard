const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const UserModel=require('../models/user.model')
const {saveUser}=require('../controller/SignupController')

routes.post('/signup',saveUser)
module.exports=routes