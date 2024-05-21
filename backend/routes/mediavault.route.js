const express=require('express')
const mediaRoute=express.Router()

mediaRoute.use(express.json())
mediaRoute.use(express.urlencoded({ extended: true }))
const auth  =require('../middleware/auth.middleware');

const MediaVaultModel=require('../models/mediavault.model')
const{getMediaInfo,getMediaInfoById,mediaInfoEditSave,mediaInfoSave,mediaInfoDelete}=require('../controllers/MediaVaultController')
mediaRoute.use(auth)
mediaRoute.get('/',getMediaInfo)
mediaRoute.get('/:id',getMediaInfoById)
mediaRoute.put('/:id',mediaInfoEditSave)
mediaRoute.post('/',mediaInfoSave)
mediaRoute.delete('/:id',mediaInfoDelete)

module.exports=mediaRoute