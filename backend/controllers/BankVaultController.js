const BankVault = require('../models/BankVault');

class BankValutController {
  // Method to fetch all bank information for a user
  async getBankInfo(req, res) {
    try {
      const bankInfo = await BankValut.find({ userId: req.user.id });
      res.json(bankInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to fetch specific bank information by ID
  async getBankInfoById(req, res) {
    try {
      const bankInfo = await BankValut.findById(req.params.id);
      if (!bankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json(bankInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to add new bank information
  async bankInfoSave(req, res) {
    const { accountNumber, accountName, IFSC, userName, password } = req.body;

    const newBankInfo = new BankValut({
      userId: req.user.id,
      accountNumber,
      accountName,
      IFSC,
      userName,
      password
    });

    try {
      const savedBankInfo = await newBankInfo.save();
      res.status(201).json(savedBankInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to update existing bank information
  async bankInfoEditSave(req, res) {
    try {
      const updatedBankInfo = await BankValut.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedBankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json(updatedBankInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to delete bank information
  async bankInfoDelete(req, res) {
    try {
      const deletedBankInfo = await BankValut.findByIdAndDelete(req.params.id);
      if (!deletedBankInfo) return res.status(404).json({ message: 'Bank information not found' });
      res.json({ message: 'Bank information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new BankValutController();
