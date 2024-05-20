const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const UserModel=require('../models/user.model')
const {checkUser}=require('../controller/LoginController')

routes.post('/login',checkUser)
module.exports=routes