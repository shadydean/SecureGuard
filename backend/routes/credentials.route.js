const express = require('express');
const credentialsRoute = express.Router();

const auth = require('../middleware/auth.middleware');

credentialsRoute.use(express.json())
credentialsRoute.use(auth);

async function isAuth(req,res,next){
    if(req.user.role === "admin")
        return next();
    else
        return res.status(401).json("Not Authorized")
}

const {getCredentials,getAllCredentials,addCredentials,changePassword,updateCredentials,removeCredentials} = require('../controllers/CredentialsController')

credentialsRoute.get('/',getCredentials)
credentialsRoute.get('/all',isAuth,getAllCredentials)
credentialsRoute.post('/',addCredentials)
credentialsRoute.put('/changePassword/:id',changePassword)
credentialsRoute.put('/:id',updateCredentials)
credentialsRoute.delete('/:id',removeCredentials)

module.exports = credentialsRoute;