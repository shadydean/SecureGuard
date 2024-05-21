const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send({ message: 'Please fill all the fields' });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(400).send({ message: 'Invalid password' });
        }
        
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        const token = jwt.sign(payload, process.env.JWT_PVT_KEY);
        
        res.header('auth-token', token).send({ token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send({ message: 'Error logging in' });
    }
};

module.exports = login;
