const MediaVaultModel = require('../models/MediaVaultModel');

class MediaValutController {
  // Method to fetch all media information for a user
  async getMediaInfo(req, res) {
    try {
      const mediaInfo = await MediaVaul
      tModel.find({ userId: req.user.id });
      res.json(mediaInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to fetch specific media information by ID
  async getMediaInfoById(req, res) {
    try {
      const mediaInfo = await MediaVaul
      tModel.findById(req.params.id);
      if (!mediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json(mediaInfo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Method to add new media information
  async mediaInfoSave(req, res) {
    const { mediaName, image, video, audio } = req.body;

    const newMediaInfo = new MediaVaul
    tModel({
      userId: req.user.id,
      mediaName,
      image,
      video,
      audio
    });

    try {
      const savedMediaInfo = await newMediaInfo.save();
      res.status(201).json(savedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to update existing media information
  async mediaInfoEditSave(req, res) {
    try {
      const updatedMediaInfo = await MediaVaul
      tModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json(updatedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Method to delete media information
  async mediaInfoDelete(req, res) {
    try {
      const deletedMediaInfo = await MediaVaul
      tModel.findByIdAndDelete(req.params.id);
      if (!deletedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json({ message: 'Media information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new MediaValutController();
