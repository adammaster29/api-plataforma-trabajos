const {poolpromise} = require('../conf/config');

const getoferta = async (req,res) =>{

try {
    const pool = await poolpromise();
    const result = await pool.request()
    .query(' SELECT e.nombre_empresa, e.nit, e.sector, e.direccion, e.telefono, o.id_oferta, o.titulo, o.descripcion, o.ubicacion, o.salario ,o.fecha_publicacion FROM ofertas o JOIN  empresas e ON  o.id_empresa=e.id_empresa ')

return res.status(200).json(result.recordset);

} catch (error) {
    console.error('error al obtener ofertas')
    return res.status(500).json({message:'error en el servidor revisa getoferta',error:error.message});
}

}

module.exports ={getoferta}