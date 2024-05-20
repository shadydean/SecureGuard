const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../utils/encrypt");

const bankVaultSchema = new mongoose.Schema({
  vaultId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountNumber: { type: String, required: true, set: encrypt, get: decrypt },
  accountName: { type: String, required: true, set: encrypt, get: decrypt },
  IFSC: { type: String, required: true },
  userName: { type: String, required: true, set: encrypt, get: decrypt },
  password: { type: String, required: true, set: encrypt, get: decrypt },
});

bankVaultSchema.set("toJSON", { getters: true, virtuals: false });

const BankVaultModel = mongoose.model("BankVault", bankVaultSchema);
module.exports = BankVaultModel;
