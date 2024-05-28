const MediaModel = require('../models/media.model');
const User = require('../models/user.model');
const { encryptBin, decryptBin } = require('../utils/encrypt');

class MediaVaultController {
  async getMediaInfo(req, res) {
    // console.log(req.query.vaultId)
    // userId -> vaultId
    try {
      let mediaInfo = await MediaModel.find({$and : [{userId : req.userId},{vaultId : req.query.vaultId}]});
      // console.log(mediaInfo,"data")
      mediaInfo = mediaInfo.map(media => {
        if(media.image){
          let {image,iv} = media
          let data = decryptBin(image,iv);
          return {
            _id : media._id,
            vaultId : media.vaultId,
            userId : media.userId,
            mediaName : media.mediaName,
            image : data,
            };
        }
        else{
          let {video,iv} = media
          let data = decryptBin(video,iv);
          return {
            _id : media._id,
            vaultId : media.vaultId,
            userId : media.userId,
            mediaName : media.mediaName,
            video : data,
            };
        }
      })
      // console.log(mediaInfo, "here is the data")
      res.status(200).json(mediaInfo);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  }

  async getMediaInfoById(req, res) {
    try {
      const mediaDocument = await MediaModel.findOne({ mediaName: req.params.id });

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
    const {image,video,audio} = req.files
    const vaultId = req.body.vaultId
    try {
      console.log(req.body)

      // const existingVault = await MediaModel.findOne({vaultId: vaultId})

      // if(existingVault){
      //   return res.status(409).json({ message: 'Vault id already exists'})
      // }
      if(image !== undefined){
        req.file = req.files.image[0]
      }
      else if(video!== undefined){
        req.file = req.files.video[0]
      }
      else
        req.file = req.files.audio[0]
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
  
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).send({ message: 'userId is required' });
      }
  
      console.log('File received:', req.file); // Debugging log
  
      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;
      const mimeType = req.file.mimetype;
  
      let mediaType;
      if (mimeType.startsWith('image')) {
        mediaType = 'image';
      } else if (mimeType.startsWith('video')) {
        mediaType = 'video';
      } else if (mimeType.startsWith('audio')) {
        mediaType = 'audio';
      } else {
        return res.status(400).send({ message: 'Unsupported file type' });
      }
  
      const newMediaVault = new MediaModel({
        vaultId: vaultId,
        // mediaName: mediaName,
        userId: userId,
        mediaName: fileName,
        [mediaType]: fileBuffer,
      });
  
      await newMediaVault.save();
  
      console.log('File uploaded successfully:', {
        fileName: fileName,
        fileSize: req.file.size,
        mimeType: mimeType,
      });
  
      res.status(200).send({ message: 'File uploaded successfully', file: req.file });
    } catch (err) {
      console.error('Error handling file upload:', err);
      res.status(500).send({ message: 'Server error' });
    }
  }

  async mediaInfoEditSave(req, res) {
    try {
      const idd = await MediaModel.findOne({ mediaName: req.params.id });
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

      const updatedMediaInfo = await MediaModel.findByIdAndUpdate(idd._id, updateData, { new: true });

      if (!updatedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json(updatedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async mediaInfoDelete(req, res) {
    try {
      const idd = await MediaModel.findOne({ mediaName: req.params.id });
      if (!idd) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      const deletedMediaInfo = await MediaModel.findByIdAndDelete(idd._id);
      if (!deletedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json({ message: 'Media information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new MediaVaultController();
