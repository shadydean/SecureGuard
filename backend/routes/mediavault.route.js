const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const MediaVaultModel=require('../models/mediavault.model')
const{getMediaInfo,mediaInfoById,mediaInfoEditSave,mediaInfoSave,mediaInfoDelete}=require('../controller/MediaVaultController')

routes.get('/',getMediaInfo)
routes.get('/:id',mediaInfoById)
routes.put('/:id',mediaInfoEditSave)
routes.post('/',mediaInfoSave)
routes.delete('/:id',bankInfoDelete)

module.exports=routes