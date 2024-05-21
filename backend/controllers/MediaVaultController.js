const MediaVaultModel = require('../models/mediavault.model');
const User = require('../models/user.model');
class MediaValutController {
  // Method to fetch all media information for a user
  async getMediaInfo(req, res) {
    try {
      const mediaInfo = await MediaVaultModel.find();
      res.json(mediaInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to fetch specific media information by ID
  async getMediaInfoById(req, res) {
    try {
      const mediaDocument = await MediaVaultModel.findOne({ mediaName: req.params.id });

      if (!mediaDocument) {
          return res.status(404).json({ message: 'Media information not found' });
      }
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

  // Method to add new media information
  async mediaInfoSave(req, res) {
    const { vaultId,mediaName, image, video, audio } = req.body;
    const newMediaInfo = new MediaVaultModel({
      vaultId,
      userId: req.user.id,
      mediaName,
      image,
      video,
      audio
    });
    try {
      const savedMediaInfo = await newMediaInfo.save();
      res.status(201).json(saveMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to update existing media information
  async mediaInfoEditSave(req, res) {
    try {
      const idd = await MediaVaultModel.findOne({mediaName: req.params.id})
      const updatedMediaInfo = await MediaVaultModel.findByIdAndUpdate(idd._id, req.body, { new: true });
      if (!updatedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json(updatedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to delete media information
  async mediaInfoDelete(req, res) {
    try {
      const idd = await MediaVaultModel.findOne({mediaName: req.params.id})
      const deletedMediaInfo = await MediaVaultModel.findByIdAndDelete(idd._id);
      if (!deletedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json({ message: 'Media information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new MediaValutController();
