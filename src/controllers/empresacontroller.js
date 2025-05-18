const {poolpromise, sql} = require('../conf/config');


const getempresa = async (req,res) =>{
try {
    const pool = await poolpromise();
    const result = await pool.request()
    .query(' SELECT  u.nombre, u.email, u.id_rol,id_empresa, e.nombre_empresa, e.nit, e.sector, e.direccion, e.telefono FROM empresas e JOIN usuarios u ON  e.id_usuario=u.id_usuario ');
    return res.status(200).json(result.recordset);
} catch (error) {
    console.log('error al obtener datos de empresa');
    return res.status(500).json({message:'error al obtener',error:error.message})
}
}

const postempresa = async (req,res) =>{
const {id_usuario,nombre_empresa,nit,sector,direccion,telefono} = req.body;
if (!id_usuario || !nombre_empresa || !nit || !sector || !direccion || !telefono) {
    return res.status(400).json({message:'error campos estan vacios revisa y vuelve a intentarlo'});
}

try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .input('nombre_empresa', sql.VarChar,nombre_empresa)
    .input('nit', sql.VarChar, nit)
    .input('sector',sql.VarChar, sector)
    .input('direccion',sql.VarChar, direccion)
    .input('telefono', sql.VarChar, telefono)
    .query(
        'INSERT INTO empresas(id_usuario,nombre_empresa,nit,sector,direccion,telefono) VALUES(@id_usuario, @nombre_empresa,@nit,@sector,@direccion,@telefono)');
        return res.status(200).json({message:'empresa agregada exitosamente'})
    
} catch (error) {
    console.error('error al agregar empresa',error)
    return res.status(500).json({message:'error al agregar una empresa nueva',error:error.message})
}
}


const putempresa = async (req,res)=>{
const{id} = req.params;
const{id_usuario,nombre_empresa,nit,sector,direccion,telefono} = req.body;

if (!id_usuario || !nombre_empresa || !nit, !sector || !direccion || !telefono) {
    return res.status(400).json({message:'error campos vacios'})
}

try {
const pool = await poolpromise();
await pool.request()
.input('id_empresa',  sql.Int, id)
.input('id_usuario', sql.Int, id_usuario)
.input('nombre_empresa', sql.VarChar, nombre_empresa)
.input('nit', sql.VarChar, nit)
.input('sector', sql.VarChar, sector)
.input('direccion', sql.VarChar, direccion)
.input('telefono', sql.VarChar, telefono)
.query(
    '  UPDATE  empresas   SET id_usuario=@id_usuario, nombre_empresa=@nombre_empresa, nit=@nit, sector=@sector, direccion=@direccion, telefono=@telefono WHERE id_empresa=@id_empresa');

return res.status(201).json({message:'empresa actualizada'})
    
} catch (error) {
    console.error('error al actualizar empresas',error);
    return res.status(500).json({message:'error al tratar de actualizar empresas', error:error.message});
}
}

const deleteempresa = async (req,res)=>{
const {id} = req.params;
try {
    const pool = await poolpromise()
    const result = await pool.request()
    .input('id_empresa', sql.Int, id)
    .query(' DELETE FROM empresas  WHERE id_empresa=@id_empresa');
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({message:'empresa no encontrada'});
    }
    return  res.status(200).json({message:'empresa eliminada'})
} catch (error) {
    console.error('error al eliminar',error)
    return res.status(400).json({message:'error no se pudo eliminar empresa',error:error.message});
}
}




module.exports = {getempresa,postempresa,putempresa,deleteempresa}