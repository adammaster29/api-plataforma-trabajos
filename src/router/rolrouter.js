const  express = require('express') 
const { getRol } = require('../controllers/rolcontroller')
const router = express.Router()


router.get('/obtener',getRol);


module.exports= router