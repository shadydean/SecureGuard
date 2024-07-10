const BankModel = require('../models/bank.model');
const BankVaultModel = require('../models/bankvault.model');
const { encrypt, decrypt } = require('../utils/encrypt');
const crypto = require('crypto');
class BankVaultController {
  async bankInfoSave(req, res) {
    try {
      const { vaultId,accountNumber, accountName, IFSC, userName, password } = req.body;
      console.log(vaultId)
      const existingInfo = await BankModel.findOne({vaultId: vaultId,accountName : accountName})
      // console.log(existingInfo)
      
      if(existingInfo){
        return res.status(409).json({ message: 'Bank info already exists'})
      }
      const iv = crypto.randomBytes(16); // Initialization vector
      const encryptedAccountNumber = encrypt(accountNumber,iv);
      const encryptedAccountName = encrypt(accountName,iv);
      const encryptedIFSC = encrypt(IFSC,iv)
      const encryptedUserName = encrypt(userName,iv);
      const encryptedPassword = encrypt(password,iv);

      const newBankInfo = new BankModel({
        vaultId,
        userId: req.user.id,
        accountNumber: encryptedAccountNumber,
        accountName: encryptedAccountName,
        IFSC : encryptedIFSC,
        userName: encryptedUserName,
        password: encryptedPassword,
        iv : iv.toString('hex')
      });

      const savedBankInfo = await newBankInfo.save();
      res.status(200).json({
        _id : savedBankInfo._id,
        vaultId,
        userId : req.user.id,
        accountNumber : accountNumber,
        accountName : accountName,
        IFSC : IFSC,
        userName : userName,
        password : password,
        iv : savedBankInfo.iv
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getBankInfo(req, res) {
    const id = req.params.id
    console.log("id -> ",id)
    try {
      const bankInfo = await BankModel.find({ vaultId : id,userId: req.user.id });
      // Decrypt sensitive data before sending the response
      const decryptedBankInfo = bankInfo.map(info => {
        const ivBuffer = Buffer.from(info.iv, 'hex');
        return{
          ...info._doc,
          accountNumber: decrypt(info.accountNumber,ivBuffer),
          accountName: decrypt(info.accountName,ivBuffer),
          IFSC: decrypt(info.IFSC,ivBuffer),
          userName: decrypt(info.userName,ivBuffer),
          password: decrypt(info.password,ivBuffer)
        }
      });

      res.json(decryptedBankInfo);
    } catch (err) {
      console.log("hello")
      res.status(500).json({ message: err.message });
    }
  }

  // Method to fetch specific bank information by ID
  async getBankInfoById(req, res) {
    const id = req.params.id
    console.log("id -> ",id)
    try {
      const bankInfo = await BankModel.findOne({ _id : id, userId : req.userId });

      if (!bankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json(bankInfo);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
  }
  async bankInfoEditSave(req, res) {
    try {
      const bankId = req.params.id;
      const idd = await BankModel.findOne({ _id: bankId });
      if (!idd) {
          return res.status(404).json({ message: 'Document with specified account number not found' });
      }
      const { accountNumber, accountName, IFSC, userName, password } = req.body;
        const iv = Buffer.from(idd.iv, 'hex'); // Use the existing IV

        const updatedFields = {};
        if (accountNumber) updatedFields.accountNumber = encrypt(accountNumber, iv);
        if (accountName) updatedFields.accountName = encrypt(accountName, iv);
        if (IFSC) updatedFields.IFSC = encrypt(IFSC, iv);
        if (userName) updatedFields.userName = encrypt(userName, iv);
        if (password) updatedFields.password = encrypt(password, iv);

        const updatedBankInfo = await BankModel.findByIdAndUpdate(bankId, updatedFields, { new: true });

        res.status(200).json(updatedBankInfo);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
  }

  // Method to delete bank information
  async bankInfoDelete(req, res) {
    try {
      const bankId = req.params.id;
      const idd = await BankModel.findOne({ _id: bankId });
      if (!idd) {
          return res.status(404).json({ message: 'Document with specified id number not found' });
      }
      const deletedBankInfo = await BankModel.findByIdAndDelete(idd._id);
      if (!deletedBankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.status(200).json({ message: 'Bank information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new BankVaultController();
