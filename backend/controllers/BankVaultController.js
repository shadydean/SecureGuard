const BankVault = require('../models/BankVault');

const addBankInfo = async (req, res) => {
  try {
    const bankInfo = new BankVault(req.body);
    await bankInfo.save();
    res.status(201).send({ message: 'Bank information added successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getBankInfo = async (req, res) => {
  try {
    const bankInfo = await BankVault.find({ userId: req.params.id });
    res.status(200).send(bankInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {addBankInfo,getBankInfo}