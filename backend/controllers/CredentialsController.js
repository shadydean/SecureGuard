const mongoose = require('mongoose');
const UserModel = require('../models/user.model');
const {getAllVaults,deleteVault} = require('../controllers/vaultController')
const {mediaInfoDelete,getMediaInfo} = require("../controllers/MediaVaultController")
const {bankInfoDelete,getBankInfo} = require("../controllers/BankVaultController")
const bcrypt = require('bcrypt');
// const { getAllVaults } = require('../controllers/vaultController');

class CredentialsController {
    async getCredentials(req,res){
        try{
            const credentials = await UserModel.find({ _id: req.user.id }).select('-password');
            res.status(200).json(credentials);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    async getAllCredentials(req,res){
        try{
            const credentials = await UserModel.find({role : 'user' }).select('-password');
            res.status(200).json(credentials);
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
            console.log(req.params.id)
            const vaults = await getAllVaults(req,res)
            const media = await 
            // const deletedCredentials = await UserModel.findByIdAndDelete(req.params.id);
            // if (!deletedCredentials) return res.status(404).json({ message: 'Credentials not found' });
            res.status(200).json({ message: 'Credentials deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async changePassword(req, res) {
        try {
            const id = req.params.id;
            console.log("id -> ",id)
            const {prevPassword,newPassword,confirmPassword} = req.body;
            if(!prevPassword || !newPassword || !confirmPassword){
                return res.status(400).json("All fields must be filled")
            }
            if(newPassword !== confirmPassword){
                return res.status(400).json("Both passwords must match")
            }
            const user = await UserModel.findById(req.params.id);
            console.log(user)
            if (!user) return res.status(404).json("Credentials not found");

            const validPassword = await bcrypt.compare(prevPassword, user.password);
        
            if (!validPassword) {
                return res.status(400).json("Invalid password");
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save()
            res.status(200).json('Credentials deleted successfully');
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: err.message });
        }
    }

    async updateCredentials(req, res) {
        try {
            const user = await UserModel.findOne({ _id: req.params.id });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // if (req.body.password) {
            //     const salt = await bcrypt.genSalt(10);
            //     req.body.password = await bcrypt.hash(req.body.password, salt);
            // }

            const updatedCredentials = await UserModel.findByIdAndUpdate(user._id, req.body, { new: true });

            if (!updatedCredentials) {
                return res.status(404).json({ message: 'Credentials not found' });
            }

            res.status(200).json(updatedCredentials);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = new CredentialsController();