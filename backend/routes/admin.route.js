const express = require('express');
const adminRoute = express.Router()

const {getUsers} = require('../controllers/adminController')
const {approveUser} = require('../controllers/adminController')
const {getUserById} = require('../controllers/adminController')
const {removeUser} = require('../controllers/adminController')
const {updateUser} = require('../controllers/adminController')
const auth = require('../middleware/auth.middleware')
const isAdmin = require('../middleware/isadmin.middleware')

adminRoute.get('/user', auth, isAdmin, getUsers)
adminRoute.post('/approveUser', auth, isAdmin, approveUser)
adminRoute.get('/user/:id', auth, isAdmin, getUserById)
adminRoute.delete('/delete/:id', auth, isAdmin, removeUser)
adminRoute.put('/update/:id', auth, isAdmin, updateUser)

module.exports = adminRoute;

