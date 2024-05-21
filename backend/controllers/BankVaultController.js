const BankVaultModel = require('../models/bankvault.model');
const { encrypt, decrypt } = require('../utils/encrypt');
const mongoose = require('mongoose');
class BankVaultController {
  async bankInfoSave(req, res) {
    try {
      const { vaultId, accountNumber, accountName, IFSC, userName, password } = req.body;

      const encryptedAccountNumber = encrypt(accountNumber);
      const encryptedAccountName = encrypt(accountName);
      const encryptedUserName = encrypt(userName);
      const encryptedPassword = encrypt(password);

      const newBankInfo = new BankVaultModel({
        vaultId,
        userId: req.user.id,
        accountNumber: encryptedAccountNumber,
        accountName: encryptedAccountName,
        IFSC,
        userName: encryptedUserName,
        password: encryptedPassword
      });

      const savedBankInfo = await newBankInfo.save();
      res.status(201).json(savedBankInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getBankInfo(req, res) {
    try {
      const bankInfo = await BankVaultModel.find({ userId: req.user.id });

      // Decrypt sensitive data before sending the response
      const decryptedBankInfo = bankInfo.map(info => ({
        ...info.toObject(),
        accountNumber: decrypt(info.accountNumber),
        accountName: decrypt(info.accountName),
        userName: decrypt(info.userName),
        password: decrypt(info.password)
      }));

      res.json(decryptedBankInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to fetch specific bank information by ID
  async getBankInfoById(req, res) {
    try {
      const encryptedId = encrypt(req.params.id);
      console.log(encryptedId);
      const bankInfo = await BankVaultModel.findOne({ accountNumber: encryptedId });

      if (!bankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json(bankInfo);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
  }
  async bankInfoEditSave(req, res) {
    try {
      const encryptedId = encrypt(req.params.id);
      const idd = await BankVaultModel.findOne({ accountNumber: encryptedId });
      if (!idd) {
          return res.status(404).json({ message: 'Document with specified account number not found' });
      }
      const updatedBankInfo = await BankVaultModel.findByIdAndUpdate(idd._id, req.body, { new: true });
      
      if (!updatedBankInfo) {
          return res.status(404).json({ message: 'Bank information not found' });
      }

      res.json(updatedBankInfo);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
  }

  // Method to delete bank information
  async bankInfoDelete(req, res) {
    try {
      const encryptedId = encrypt(req.params.id);
      const idd = await BankVaultModel.findOne({ accountNumber: encryptedId });
      if (!idd) {
          return res.status(404).json({ message: 'Document with specified account number not found' });
      }
      const deletedBankInfo = await BankVaultModel.findByIdAndDelete(idd._id);
      if (!deletedBankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json({ message: 'Bank information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new BankVaultController();
