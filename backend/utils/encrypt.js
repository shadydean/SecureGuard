const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const key = process.env.ENCRYPTION_KEY; // Encryption key (32 bytes for AES-256)

function encrypt(text,iv) {
  // console.log("iv -> ",iv)
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text,'utf-8','hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText,iv) {
  // console.log("decrypt -> ", iv)
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptBin(data) {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    encryptedData: encrypted.toString('hex'),
    iv: iv.toString('hex')
  };
}

function decryptBin(encryptedData, iv) {
  const algorithm = 'aes-256-cbc';
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

module.exports = { encrypt, decrypt, encryptBin, decryptBin };