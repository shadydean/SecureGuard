const MediaVaultModel = require('../models/mediavault.model');
const BankVaultModel = require('../models/bankvault.model');
class VaultController {

  async getAllVaults(req,res){
    const {vaultType} = req.body
    try {
        if(vaultType === "media"){
            const mediaVaults = await MediaVaultModel.find({userId : req.userId});
            return res.status(200).json(mediaVaults);
        }
        else{
            const bankVaults = await BankVaultModel.find({userId : req.userId});
            return res.status(200).json(bankVaults);
        }
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
            res.status(201).json({ message: 'Vault created successfully' });
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
            res.status(201).json({ message: 'Vault created successfully' });
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
        let vault;
        if(vaultType === "media"){
            vault = await MediaVaultModel.findOne({name : name,userId : req.userId })
        }
        else
            vault = await BankVaultModel.findOne({ name : name,userId : req.userId });

        if(!vault){
            return res.status(404).json({ message: "Vault not found" });
        }
        vault.name = name;
        await vault.save();
        res.status(200).json({ message: 'Vault updated successfully' });
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
