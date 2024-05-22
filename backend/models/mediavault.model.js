const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encrypt');

const mediaVaultSchema = new mongoose.Schema({
  vaultId: { type: String, required: true, default: 's'},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaName: { type: String, required: true ,default:'asd',unique: true},
  image: { type: Buffer
  },
  video: { type: Buffer
     },
  audio: { type: Buffer
    }
});
mediaVaultSchema.index({ image: 1 }, { unique: false });



const MediaVaultModel = mongoose.model('MediaVault', mediaVaultSchema);
module.exports = MediaVaultModel;