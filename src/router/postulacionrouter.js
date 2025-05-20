const express = require('express');
const { getpostulacion, postpostulacion, putpostulacion, deletepostulacion } = require('../controllers/postulacioncontroller');
const router = express.Router()


router.get('/obtener',getpostulacion);
router.post('/agregar', postpostulacion);
router.put('editar',putpostulacion)
router.delete('/eliminar',deletepostulacion);

module.exports = router 