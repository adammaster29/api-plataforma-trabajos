const express = require('express');
const { getcandidato, postcandidato, putcandidato, deletecandidato } = require('../controllers/candidatocontroller');
const router = express.Router();
const upload = require('../middleware/upload')
const verifyToken = require('../middleware/auth')

router.get('/obtener',verifyToken,getcandidato);
router.post('/agregar',verifyToken,upload.single('hoja_vida'),postcandidato);
router.put('/editar/:id',verifyToken,putcandidato)
router.delete('/eliminar/:id',verifyToken,deletecandidato)

module.exports= router;