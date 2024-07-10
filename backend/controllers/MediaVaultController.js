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
        else if(media.audio){
          let {audio,iv} = media
          let data = decryptBin(audio,iv);
          return {
            _id : media._id,
            vaultId : media.vaultId,
            userId : media.userId,
            mediaName : media.mediaName,
            audio : data,
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
      const media = await MediaModel.findOne({$and : [{userId : req.userId},{_id : req.params.id}]});

      if (!media) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      if(media.image){
        let {image,iv} = media
        let data = decryptBin(image,iv);
        return res.status(200).json({
          _id : media._id,
          vaultId : media.vaultId,
          userId : media.userId,
          mediaName : media.mediaName,
          image : data,
          });
      }
      else if(media.audio){
        let {audio,iv} = media
        let data = decryptBin(audio,iv);
        return res.status(200).json({
          _id : media._id,
          vaultId : media.vaultId,
          userId : media.userId,
          mediaName : media.mediaName,
          audio : data,
          });
      }
      else{
        let {video,iv} = media
        let data = decryptBin(video,iv);
        return res.status(200).json({
          _id : media._id,
          vaultId : media.vaultId,
          userId : media.userId,
          mediaName : media.mediaName,
          video : data
          });
      }
    } catch (err) {

      res.status(500).json({ message: err.message });
    }
  }


  async mediaInfoSave(req, res) {
    // console.log("files",req.files)
    const {image,video,audio} = req.files
    const vaultId = req.body.vaultId
    try {
      // console.log(req.files)

      // const existingVault = await MediaModel.findOne({vaultId: vaultId})

      // if(existingVault){
      //   return res.status(409).json({ message: 'Vault id already exists'})
      // }
      if(image !== undefined){
        req.file = req.files?.image[0]
      }
      else if(video!== undefined){
        req.file = req.files?.video[0]
      }
      else
        req.file = req.files?.audio[0]
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
  
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).send({ message: 'userId is required' });
      }
  
      // console.log('File received:', req.file); // Debugging log
  
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
  
      // console.log('File uploaded successfully:', {
      //   fileName: fileName,
      //   fileSize: req.file.size,
      //   mimeType: mimeType,
      // });

      return res.status(200).json({
        _id : newMediaVault._id,
        vaultId : vaultId,
        userId : userId,
        mediaName : fileName,
        [mediaType] : req.file.buffer,
      })
    } catch (err) {
      console.error('Error handling file upload:', err);
      res.status(500).send({ message: 'Server error' });
    }
  }

  async mediaInfoEditSave(req, res) {
    try {
      const idd = await MediaModel.findOne({ _id: req.params.id });
      if (!idd) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      const updateData = req.body;
      // if(updateData.mediaName){
      //   idd.mediaName = updateData.mediaName;
      // }
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
      res.status(200).json(updatedMediaInfo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async mediaInfoDelete(req, res) {
    try {
      const idd = await MediaModel.findOne({ _id: req.params.id });
      if (!idd) {
        return res.status(404).json({ message: 'Media information not found' });
      }

      const deletedMediaInfo = await MediaModel.findByIdAndDelete(req.params.id);
      if (!deletedMediaInfo) return res.status(404).json({ message: 'Media information not found' });
      res.json({ message: 'Media information deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new MediaVaultController();
