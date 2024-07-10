const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/encrypt");

const bankSchema = new mongoose.Schema({
  vaultId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankVault', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  IFSC: { type: String, required: true },
  userName: { type: String, required: true},
  password: { type: String, required: true },
  iv: { type: String },
});

const BankModel = mongoose.model("Bank", bankSchema);
module.exports = BankModel;
