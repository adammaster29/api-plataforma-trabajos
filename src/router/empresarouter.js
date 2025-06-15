const express = require('express');
const { getempresa, postempresa, putempresa, deleteempresa, getempresaid } = require('../controllers/empresacontroller');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/obtener',getempresa);
router.get('/obtener/:id',getempresaid)
router.post('/agregar',verifyToken,postempresa);
router.put('/editar/:id',verifyToken,putempresa)
router.delete('/eliminar/:id',verifyToken,deleteempresa)

module.exports= router