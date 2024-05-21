const express = require('express');
const loginRoute = express.Router();

loginRoute.use(express.json());
loginRoute.use(express.urlencoded({ extended: true }));

const login = require('../controllers/LoginController');

loginRoute.post('/', login);

module.exports = loginRoute;