const express = require('express');
const routes = express.Router()

const {getUsers} = require('../controllers/adminController')
const {approveUser} = require('../controllers/adminController')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

routes.get('/user', auth, isAdmin, getUsers)
routes.post('/approveUser', auth, isAdmin, approveUser)
routes.get('/user/:id', auth, isAdmin, getUserById)
routes.delete('/delete/:id', auth, isAdmin, removeUser)
routes.put('/update/:id', auth, isAdmin, updateUser)

module.exports = routes;