const express = require('express');
const vaultRoute = express.Router();
const auth = require('../middleware/auth.middleware');
vaultRoute.use(auth);

const {createVault,deleteVault,updateVault,getAllVaults} = require('../controllers/vaultController')

//get all vaults of a user
vaultRoute.get('/',getAllVaults)
vaultRoute.post('/',createVault)
vaultRoute.put('/:id',updateVault)
vaultRoute.delete('/:id',deleteVault)

module.exports = vaultRoute;