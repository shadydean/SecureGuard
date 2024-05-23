const MediaVaultModel = require('../models/mediavault.model');
const User = require('../models/user.model');
const { encryptBin, decryptBin } = require('../utils/encrypt');

class MediaVaultController {
  async getMediaInfo(req, res) {
    try {
      const mediaInfo = await MediaVaultModel.find();
      res.json(mediaInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getMediaInfoById(req, res) {
    try {
      const mediaDocument = await MediaVaultModel.findOne({ mediaName: req.params.id });

      if (!mediaDocument) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      mediaDocument.image = mediaDocument.image ? decryptBin(mediaDocument.image) : null;
      mediaDocument.video = mediaDocument.video ? decryptBin(mediaDocument.video) : null;
      mediaDocument.audio = mediaDocument.audio ? decryptBin(mediaDocument.audio) : null;

      const user = await User.findById(mediaDocument.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User information not found' });
      }

      const mediaInfo = {
        media: mediaDocument,
        user: user
      };

      res.json(mediaInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async mediaInfoSave(req, res) {

    const { vaultId, mediaName} = req.body;
    const image =  req.file ?   req.file.path : null;
    const video = req.file ? req.file.path : null;
    const audio = req.file ? req.file.path : null;
    // console.log(req.file)
    // if (!image) {
    //   return res.status(400).json({ message: 'Image upload failed.' });
    // }
    const encryptedImage = image ? encryptBin(Buffer.from(image, 'binary')) : null;
    const encryptedVideo = video ? encryptBin(Buffer.from(video, 'binary')) : null;
    const encryptedAudio = audio ? encryptBin(Buffer.from(audio, 'binary')) : null;

    const newMediaInfo = new MediaVaultModel({
      vaultId,
      userId: req.user.id,
      mediaName,
      image: encryptedImage,
      video: encryptedVideo,
      audio: encryptedAudio
    });

    try {
      const savedMediaInfo = await newMediaInfo.save();
      console.log(req.body)
      res.status(201).json(savedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async mediaInfoEditSave(req, res) {
    try {
      const idd = await MediaVaultModel.findOne({ mediaName: req.params.id });
      if (!idd) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      const updateData = req.body;

      if (updateData.image) {
        updateData.image = encryptBin(Buffer.from(updateData.image, 'binary'));
      }
      if (updateData.video) {
        updateData.video = encryptBin(Buffer.from(updateData.video, 'binary'));
      }
      if (updateData.audio) {
        updateData.audio = encryptBin(Buffer.from(updateData.audio, 'binary'));
      }

      const updatedMediaInfo = await MediaVaultModel.findByIdAndUpdate(idd._id, updateData, { new: true });

      if (!updatedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json(updatedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async mediaInfoDelete(req, res) {
    try {
      const idd = await MediaVaultModel.findOne({ mediaName: req.params.id });
      if (!idd) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      const deletedMediaInfo = await MediaVaultModel.findByIdAndDelete(idd._id);
      if (!deletedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json({ message: 'Media information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new MediaVaultController();
