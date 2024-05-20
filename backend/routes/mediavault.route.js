const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const MediaVaultModel=require('../models/mediavault.model')
const{getMediaInfo,mediaInfoById,mediaInfoEditSave,mediaInfoSave,mediaInfoDelete}=require('../controller/MediaVaultController')

routes.get('/media',getMediaInfo)
routes.get('/media/:id',mediaInfoById)
routes.put('/media/:id',mediaInfoEditSave)
routes.post('/media',mediaInfoSave)
routes.delete('/bank/:id',bankInfoDelete)
module.exports=routes