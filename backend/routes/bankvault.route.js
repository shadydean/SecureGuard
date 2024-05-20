const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const BankValutModel=require('../models/bankvault.model')
const{getBankInfo,bankInfoById,bankInfoEditSave,bankInfoSave,bankInfoDelete}=require('../controller/BankVaultController')

routes.get('/',getBankInfo)
routes.get('/:id',bankInfoById)
routes.put('/:id',bankInfoEditSave)
routes.post('/',bankInfoSave)
routes.delete('/:id',bankInfoDelete)

module.exports=routes