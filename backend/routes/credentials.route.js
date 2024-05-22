const express = require('express');
const credentialsRoute = express.Router();

const auth = require('../middleware/auth.middleware');

credentialsRoute.use(express.json())
credentialsRoute.use(auth);

const {getCredentials,addCredentials,updateCredentials,removeCredentials} = require('../controllers/CredentialsController')

credentialsRoute.get('/',getCredentials)
credentialsRoute.post('/',addCredentials)
credentialsRoute.put('/:id',updateCredentials)
credentialsRoute.delete('/:id',removeCredentials)

module.exports = credentialsRoute;