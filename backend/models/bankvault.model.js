const mongoose = require('mongoose')

const bankVaultSchema = new mongoose.Schema({
    vaultId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accountNumber:{
        type: Number,
        required: true,
        unique: true
    },
    IFSC:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

const BankVault = mongoose.model('BankVault', bankVaultSchema)

module.exports = BankVault;