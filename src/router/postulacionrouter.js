const express = require('express');
const { getpostulacion, postpostulacion, putpostulacion, deletepostulacion } = require('../controllers/postulacioncontroller');
const router = express.Router()
const verifyToken = require('../middleware/auth')


router.get('/obtener',verifyToken ,getpostulacion);
router.post('/agregar',verifyToken, postpostulacion);
router.put('editar',verifyToken,putpostulacion)
router.delete('/eliminar',verifyToken,deletepostulacion);

module.exports = router 