const express = require('express');
const { getempresa, postempresa, putempresa, deleteempresa } = require('../controllers/empresacontroller');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/obtener',verifyToken,getempresa);
router.post('/agregar',verifyToken,postempresa);
router.put('/editar/:id',verifyToken,putempresa)
router.delete('/eliminar/:id',verifyToken,deleteempresa)

module.exports= router