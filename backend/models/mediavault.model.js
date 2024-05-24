const mongoose = require('mongoose');
const { encryptBin, decryptBin } = require('../utils/encrypt');

const mediaVaultSchema = new mongoose.Schema({
  vaultId: { type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mediaName: { type: String, required: true, unique: true },
  image: { type: Buffer, unique: false },
  video: { type: Buffer, unique: false },
  audio: { type: Buffer, unique: false },
  iv: { type: String },
});

mediaVaultSchema.pre('save', function (next) {
  console.log('Image:', this.image);
  console.log('Video:', this.video);
  console.log('Audio:', this.audio);

  if (this.image) {
    const encrypted = encryptBin(this.image);
    this.image = Buffer.from(encrypted.encryptedData, 'hex');
    this.iv = encrypted.iv;  // Store the iv for decryption
  }
  if (this.video) {
    const encrypted = encryptBin(this.video);
    this.video = Buffer.from(encrypted.encryptedData, 'hex');
    this.iv = encrypted.iv;
  }
  if (this.audio) {
    const encrypted = encryptBin(this.audio);
    this.audio = Buffer.from(encrypted.encryptedData, 'hex');
    this.iv = encrypted.iv;
  }
  next();
});

mediaVaultSchema.methods.decryptMedia = function () {
  if (this.image) {
    this.image = decryptBin(this.image.toString('hex'), this.iv);
  }
  if (this.video) {
    this.video = decryptBin(this.video.toString('hex'), this.iv);
  }
  if (this.audio) {
    this.audio = decryptBin(this.audio.toString('hex'), this.iv);
  }
};

const MediaVaultModel = mongoose.model('MediaVault', mediaVaultSchema);
module.exports = MediaVaultModel;
