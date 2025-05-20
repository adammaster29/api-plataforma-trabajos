const express = require('express');
const { getoferta, postoferta, putoferta, deleteoferta } = require('../controllers/ofertacontroller');
const router = express.Router();

router.get('/obtener',getoferta);
router.post('/agregar',postoferta);
router.put('/editar/:id',putoferta);
router.delete('/eliminar/:id',deleteoferta)
module.exports= router