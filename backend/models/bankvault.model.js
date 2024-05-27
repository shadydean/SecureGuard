const mongoose = require('mongoose');

const bankVaultSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});

bankVaultSchema.set('toJSON', { getters: true, virtuals: false });

const BankVaultModel = mongoose.model('BankVault', bankVaultSchema);
module.exports = BankVaultModel;
