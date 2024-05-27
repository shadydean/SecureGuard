const mongoose = require('mongoose');

const mediaVaultSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});

mediaVaultSchema.set('toJSON', { getters: true, virtuals: false });

const MediaVaultModel = mongoose.model('MediaVault', mediaVaultSchema);
module.exports = MediaVaultModel;
