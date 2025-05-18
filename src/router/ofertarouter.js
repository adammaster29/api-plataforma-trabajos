const express = require('express');
const { getoferta } = require('../controllers/ofertacontroller');
const router = express.Router();

router.get('/obtener',getoferta)

module.exports= router