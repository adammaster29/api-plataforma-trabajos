const { getusuario, login, postusuario, putusuario, deleteusuario, getUsuariosPaginados, forgotPassword, resetPassword } = require('../controllers/usuariocontroller');
const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();


router.get('/usuarios',verifyToken,getUsuariosPaginados);
router.get('/obtener',getusuario);
router.post('/login',login);
router.post('/recuperarpassword',forgotPassword);
router.post('/resetpassword/:token',resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/agregar',postusuario);
router.put('/editar/:id',verifyToken,putusuario);
router.delete('/eliminar/:id',verifyToken,deleteusuario);

module.exports= router;