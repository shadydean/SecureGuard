const express=require('express')
const routes=express.Router()

routes.use(express.json())
routes.use(express.urlencoded({ extended: true }))

const BankValutModel=require('../models/bankvault.model')
const{getBankInfo,bankInfoById,bankInfoEditSave,bankInfoSave,bankInfoDelete}=require('../controller/BankVaultController')

routes.get('/bank',getBankInfo)
routes.get('/bank/:id',bankInfoById)
routes.put('/bank/:id',bankInfoEditSave)
routes.post('/bank',bankInfoSave)
routes.delete('/bank/:id',bankInfoDelete)
module.exports=routes