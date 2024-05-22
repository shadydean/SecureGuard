const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const key = process.env.ENCRYPTION_KEY; // Encryption key (32 bytes for AES-256)
const iv = crypto.randomBytes(16); // Initialization vector

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function encryptBin(buffer) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]); 
}

function decryptBin(buffer) {
  let iv = buffer.slice(0, 16); 
  let encryptedText = buffer.slice(16); 
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

module.exports = { encrypt, decrypt, encryptBin, decryptBin };