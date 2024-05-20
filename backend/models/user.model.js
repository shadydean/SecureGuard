const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    set: encrypt, // Encrypt the password before saving
    get: decrypt // Decrypt the password when retrieving
  },
  mobileNumber: { type: String, required: true },
  active: { type: Boolean, default: true },
  role: { type: String, required: true,
    enum: ['user', 'admin'], default: 'user'
   }
});

userSchema.set('toJSON', { getters: true, virtuals: false });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
