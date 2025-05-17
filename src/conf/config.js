
require('dotenv').config();
const sql = require('mssql');

const config={
server: process.env.BD_SERVER,
user : process.env.BD_USERNAME,
password: process.env.BD_PASSWORD,
database : process.env.BD_DATABASE,
options:{
    encrypt: true,
    trustServerCertificate: true
}


}
const poolpromise = async ()=> {
try {
    const pool =  await sql.connect(config);
    console.log('Conectado ala base de datos');
    return pool

} catch (error) {
    console.error('Error de conexion a la base de datos:', error);
    
}


}
module.exports = {
    sql,
    poolpromise
}