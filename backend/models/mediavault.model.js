const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encrypt');

const mediaVaultSchema = new mongoose.Schema({
  vaultId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaName: { type: String, required: true ,unique: true},
  image: { type: Buffer
    // required: true, set: encrypt, get: decrypt
  },
  video: { type: Buffer
    //  required: true, set: encrypt, get: decrypt
     },
  audio: { type: Buffer
    //  required: true, set: encrypt, get: decrypt
    }
});

// mediaVaultSchema.set('toJSON', { getters: true, virtuals: false });

const MediaVaultModel = mongoose.model('MediaVault', mediaVaultSchema);
module.exports = MediaVaultModel;
