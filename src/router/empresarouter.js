const express = require('express');
const { getempresa, postempresa, putempresa, deleteempresa } = require('../controllers/empresacontroller');
const router = express.Router();

router.get('/obtener',getempresa);
router.post('/agregar',postempresa);
router.put('/editar/:id',putempresa)
router.delete('/eliminar/:id',deleteempresa)

module.exports= router