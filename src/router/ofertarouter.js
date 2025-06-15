const express = require('express');
const { getoferta, postoferta, putoferta, deleteoferta, getofertaid } = require('../controllers/ofertacontroller');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/obtener/:id',getofertaid)
router.get('/obtener',getoferta);
router.post('/agregar',verifyToken,postoferta);
router.put('/editar/:id',verifyToken,putoferta);
router.delete('/eliminar/:id',verifyToken,deleteoferta)
module.exports= router