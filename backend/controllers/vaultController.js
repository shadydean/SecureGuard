const MediaVaultModel = require('../models/mediavault.model');
const BankVaultModel = require('../models/bankvault.model')
const BankModel = require("../models/bank.model")
const MediaModel = require("../models/media.model")
class VaultController {

 async getVaultInfoById(req,res) {
    try {
        const vaultId = req.params.id;
        const vaultType = req.query.vaultType
        console.log(vaultType,vaultId)
        if(vaultType === 'media') {
            let vaultInfo = await MediaModel.find({$and : [{userId : req.userId},{vaultId : vaultId}]}).exec();
            if(!vaultInfo)
               return res.status(400).json("No such vault exists")

            return res.status(200).json(vaultInfo)

        } else if(vaultType === 'bank') {
            let vaultInfo = await BankModel.findOne({$and : [{userId : req.userId},{vaultId : vaultId}]}).exec();
            if(!vaultInfo)
               return res.status(400).json("No such vault exists")

            return res.status(200).json(vaultInfo)
        }
        else
            return res.status(400).json("something went wrong")
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({message : err.message})
    }
 }

  async getAllVaults(req,res){
    try {
            const mediaVaults = await MediaVaultModel.find({userId : req.userId});
            const bankVaults = await BankVaultModel.find({userId : req.userId});
            return res.status(200).json({mediaVaults : mediaVaults, bankVaults : bankVaults});
        } 
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
  }

  async createVault(req, res) {
    try {
        const { name,vaultType } = req.body;
        if(vaultType === "media"){
            const allVaults = await MediaVaultModel.find({userId : req.userId})
            for(let vault of allVaults){
                if(vault.name === name){
                    return res.status(400).json({ message: "Vault already exists" });
                }
            }
    
            const vault = new MediaVaultModel({ name : name,userId : req.userId });
            await vault.save();
            res.status(201).json(vault);
        }
        else {
            const allBankVaults = await BankVaultModel.find({userId : req.userId})
            for(let vault of allBankVaults){
                if(vault.name === name){
                    return res.status(400).json({ message: "Vault already exists" });
                }
            }
    
            const vault = new BankVaultModel({ name : name,userId : req.userId });
            await vault.save();
            res.status(201).json(vault);
        }
        } 
    catch (error) {
        console.log(error)
            res.status(500).json({ message: error.message });
    }
    
  }

  async updateVault(req,res){
    try {
        const { name,vaultType } = req.body;
        const vaultId = req.params.id;
        let vault;
        if(vaultType === "media"){
            vault = await MediaVaultModel.findOne({name : name,userId : req.userId })
        }
        else
            vault = await BankVaultModel.findOne({ name : name,userId : req.userId });

        if(vault){
            return res.status(400).json({ message: "Vault Name already exists" });
        }

        let currVault;
        if(vaultType === "media"){
            currVault = await MediaVaultModel.findOne({ _id : vaultId,userId : req.userId});
        }
        else {
            currVault = await BankVaultModel.findOne({_id : vaultId, userId : req.userId})
        }
        currVault.name = name;
        await currVault.save();
        res.status(200).json(currVault);
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
            
  }

  async deleteVault(req,res){
    try {
        const { id,vaultType } = req.params;
        if(vaultType === "media"){
            const vault = await MediaVaultModel.findById(id);
            if(!vault){
                return res.status(404).json({ message: 'Vault not found' });
            }
            await MediaVaultModel.deleteOne({ _id: id });
        }
        else {
            const vault = await BankVaultModel.findById(id);
        if(!vault){
            return res.status(404).json({ message: 'Vault not found' });
        }
        await BankVaultModel.deleteOne({ _id: id });
        }
        
        res.status(200).json({ message: 'Vault deleted successfully' });
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }

  }
}

module.exports = new VaultController();
