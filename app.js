require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { poolpromise } = require('./src/conf/config');
const rolrouter = require('./src/router/rolrouter');
const  usuariorouter = require('./src/router/usuariorouter')
const candidatorouter = require('./src/router/candidatorouter')
const app = express();
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use(cors());
poolpromise()

app.use('/api/rol', rolrouter);
app.use('/api/usuario',usuariorouter);
app.use('/api/candidato',candidatorouter);


const port = process.env.DB_PORT || 3000
app.listen(port,()=>{
console.log(`conectado en el puerto ${port}`);
});