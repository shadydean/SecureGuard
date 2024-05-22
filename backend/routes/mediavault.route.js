const express=require('express')
const mediaRoute=express.Router()

mediaRoute.use(express.json())
mediaRoute.use(express.urlencoded({ extended: true }))
const auth  =require('../middleware/auth.middleware');

const MediaVaultModel=require('../models/mediavault.model')
const{getMediaInfo,getMediaInfoById,mediaInfoEditSave,mediaInfoSave,mediaInfoDelete}=require('../controllers/MediaVaultController')
const upload = require('../middleware/upload.middleware')

mediaRoute.use(auth)
mediaRoute.get('/',getMediaInfo)
mediaRoute.get('/:id',getMediaInfoById)
mediaRoute.post('/', upload.single('image'), mediaInfoSave);
mediaRoute.put('/:id', upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'audio' }]), mediaInfoEditSave);
mediaRoute.delete('/:id',mediaInfoDelete)

module.exports=mediaRoute