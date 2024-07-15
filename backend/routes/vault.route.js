const express = require('express');
const vaultRoute = express.Router();
const auth = require('../middleware/auth.middleware');
const approved = require('../middleware/approved.middleware')
vaultRoute.use(auth);
vaultRoute.use(approved);

const {createVault,deleteVault,updateVault,getAllVaults,getVaultInfoById} = require('../controllers/vaultController')

//get all vaults of a user
vaultRoute.get('/:id',getVaultInfoById)
vaultRoute.get('/',getAllVaults)
vaultRoute.post('/',createVault)
vaultRoute.put('/:id',updateVault)
vaultRoute.delete('/:id',deleteVault)

module.exports = vaultRoute;