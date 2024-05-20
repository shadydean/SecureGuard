const MediaVault = require('../models/MediaVault');

const addMediaInfo = async (req, res) => {
  try {
    const mediaInfo = new MediaVault(req.body);
    await mediaInfo.save();
    res.status(201).send({ message: 'Media information added successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getMediaInfo = async (req, res) => {
  try {
    const mediaInfo = await MediaVault.find({ userId: req.params.id });
    res.status(200).send(mediaInfo);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {addMediaInfo,getMediaInfo}
