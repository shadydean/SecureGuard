const mongoose = require('mongoose');
const {generateKeyPair} = require("../utils/keys")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const saveUser = async (req, res) => {
    const {publicKey, privateKey} = await generateKeyPair();
    const { email, password, mobilenumber,name } = req.body;

    console.log('Request body:', req.body);

    if (!email || !password || !mobilenumber) {
        return res.status(400).send({ message: 'Please fill all the fields' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User with email ${email} already exists`);
            return res.status(409).send({ message: "User already exists" });
        }

        console.log(`Creating new user with email: ${email}`);

        user = new User({ email, password, mobilenumber, active: false,name});
        try {
            const salt = await bcrypt.genSalt(10);
            console.log(`Generated salt: ${salt}`);
            user.password = await bcrypt.hash(password, salt);
            console.log(`Hashed password: ${user.password}`);
        } catch (error) {
            console.error(`Error during bcrypt process: ${error.message}`);
            return res.status(500).send({ message: `Error during bcrypt process: ${error.message}` });
        }
        await user.save();
        console.log(`User with email ${email} created successfully`);
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        const token = jwt.sign(payload, process.env.JWT_PVT_KEY);
        
        res.header('auth-token', token).send({ token });
        // res.status(201).send({ message: "User created successfully" });

    } catch (err) {
        console.error(`Error creating user: ${err.message}`);
        res.status(500).send({ message: `Error creating user: ${err.message}` });
    }
};

module.exports = saveUser;
