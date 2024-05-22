const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

class CredentialsController {
    async getCredentials(req,res){
        try{
            const credentials = await UserModel.find({ _id: req.user.id }).select('-password');
            res.json(credentials);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    async addCredentials(req, res) {
        const { email, password, mobilenumber } = req.body;

        if (!email || !password || !mobilenumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newCredentials = new UserModel({
                email,
                password: hashedPassword,
                mobilenumber
            });

            const savedCredentials = await newCredentials.save();
            res.status(201).json(savedCredentials);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async removeCredentials(req, res) {
        try {
            const deletedCredentials = await UserModel.findByIdAndDelete(req.params.id);
            if (!deletedCredentials) return res.status(404).json({ message: 'Credentials not found' });
            res.json({ message: 'Credentials deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async updateCredentials(req, res) {
        try {
            const user = await UserModel.findOne({ email: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'Document with specified email not found' });
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedCredentials = await UserModel.findByIdAndUpdate(user._id, req.body, { new: true });

            if (!updatedCredentials) {
                return res.status(404).json({ message: 'Credentials not found' });
            }

            res.json(updatedCredentials);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = new CredentialsController();