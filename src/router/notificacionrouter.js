const express = require('express');
const { postnotificacion, getNotificacion } = require('../controllers/notificacioncontroller');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.post('/agregar',verifyToken,postnotificacion);
router.get('/obtener/:id',verifyToken,getNotificacion);


module.exports= router