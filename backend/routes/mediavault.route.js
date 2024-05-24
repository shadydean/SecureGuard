const express = require('express');
const mediaRoute = express.Router();
const auth = require('../middleware/auth.middleware');
const {
  getMediaInfo,
  getMediaInfoById,
  mediaInfoEditSave,
  mediaInfoSave,
  mediaInfoDelete
} = require('../controllers/MediaVaultController');
const upload = require('../middleware/upload.middleware');

mediaRoute.use(express.json());
mediaRoute.use(express.urlencoded({ extended: true }));

mediaRoute.use(auth);
mediaRoute.get('/', getMediaInfo);
mediaRoute.get('/:id', getMediaInfoById);
mediaRoute.post('/',  upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'audio' }]), mediaInfoSave);
mediaRoute.put('/:id', upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'audio' }]), mediaInfoEditSave);
mediaRoute.delete('/:id', mediaInfoDelete);

module.exports = mediaRoute;
