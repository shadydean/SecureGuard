const mongoose = require('mongoose')

const mediaVaultSchema = new mongoose.Schema({
    vaultId:{
        type:String,
        required:true,
        unique:true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mediaName:{
        type:String,
        required:true,
    },
    image:{
        type:Buffer,
        required:false,
    },
    video:{
        type:Buffer,
        required:false,
    },
    audio:{
        type:Buffer,
        required:false,
    }

})

const MediaVault = mongoose.model('MediaVault', mediaVaultSchema)

module.exports = MediaVault;