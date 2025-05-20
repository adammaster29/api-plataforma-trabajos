const {poolpromise, sql} = require('../conf/config');


const getpostulacion = async (req,res) => {

try {
    const pool = await poolpromise();
    const result = await pool.request()
    .query(' SELECT c.id_usuario, c.experiencia, c.educacion, c.hoja_vida, o.id_empresa, o.titulo, o.descripcion, o.ubicacion, o.salario, p.id_postulacion, p.fecha_postulacion FROM postulaciones AS p JOIN candidatos AS c ON   p.id_candidato=c.id_candidato    JOIN ofertas AS o ON   p.id_oferta=o.id_oferta    ')
 return res.status(200).json(result.recordset);
} catch (error) {
    console.error('error al obtener postulacion',error);
    return res.status(500).json({message:'error al obtener las postulaciones',error:error.message});
}
}

const postpostulacion = async (req,res) => { 
const {id_candidato,id_oferta} = req.body;
if (!id_candidato || !id_oferta) {
    return res.status(400).json({message:'campos vacios'})
}

try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_candidato',sql.Int,id_candidato)
    .input('id_oferta',sql.Int,id_oferta)
    .query(
        ' INSERT INTO postulaciones(id_candidato,id_oferta) VALUES(@id_candidato,@id_oferta)'
    );
    return res.status(201).json({message:'exito al agregar postulacion'});
} catch (error) {
    console.error('error no se agrego una postulacion',error);
    return res.status(500).json({message:'error al agregar error del servidor',error:error.message})
}
}

const putpostulacion = async (req,res) => {
    const{id} = req.params;
    const {id_candidato,id_oferta} = req.body;
    if (!id_candidato || !id_oferta) {
    return res.status(400).json({message:'campos vacios'})
}
try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_postulacion', sql.Int, id)
    .iput('id_candidato', sql.Int,id_candidato)
    .input('id_oferta',sql.Int,id_oferta)
    .query(`
            UPDATE postulaciones SET id_candidato=@id_candidato, id_oferta=@id_oferta WHERE id_postulacion=@id_postulacion`);
            return res.status(200).json({message:'exito al actualizar'})
} catch (error) {
    console.error('error al actualizar',error)
    return res.status(500).json({message:'error al actualizar, error en el servidor',error:error.message});
}
}

const deletepostulacion = async(req,res) => {
    const {id} = req.params;
    try {
        const pool = await poolpromise();
        const result = await pool.request()
        .input('id_postulacion', sql.Int, id)
        .query(' DELETE FROM postulaciones WHERE id_postulacion=@id_postulacion');
         if (result.rowsAffected[0]===0) {
            return res.status(400).json({message:'error no encontro postulaciones'})
         }
         return res.sta

    } catch (error) {
        console.error('error al eliminar',error);
        return res.status(500).json({message:'error al eliminar,error del servidor',error:error.message})
        
    }

}


module.exports={getpostulacion,postpostulacion,putpostulacion,deletepostulacion}