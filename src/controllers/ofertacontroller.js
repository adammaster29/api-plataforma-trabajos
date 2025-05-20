const {poolpromise, sql} = require('../conf/config');

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

const postoferta = async (req,res) =>{
const {id_empresa,titulo,descripcion,ubicacion,salario} = req.body;
if (!id_empresa || !titulo || !descripcion || !ubicacion || !salario) {
    return res.status(400).json({message:'error campos vacios'})
}
     try {
        const pool = await  poolpromise();
        await pool.request()
        .input('id_empresa',sql.Int,id_empresa)
        .input('titulo',sql.VarChar.titulo)
        .input('descripcion',sql.VarChar,descripcion) 
        .input('ubicacion',sql.VarChar,ubicacion)
        .input('salario',sql.VarChar,salario)  
        .query(
            'INSERT INTO ofertas (id_empresa,titulo,descripcion,ubicacion,salario) VALUES(@id_empresa,@titulo,@descripcion,@ubicacion,@salario)');
         return res.status(201).json({message:'exito agregaste una oferta nueva'})
             
     } catch (error) {
        console.error('error al agregar',error)
        return res.status(500).json({message:'error al guardar ofertas erroe en el servidor ', error:error.message})
     }
}

const putoferta = async (req,res) =>{
const {id} =req.params;
const {id_empresa,titulo,descripcion,ubicacion,salario} = req.body;
if (!id_empresa || !titulo || !descripcion || !ubicacion || !salario) {
    return res.status(400).json({message:'error campos vacios'})
}
try {
    const pool = await poolpromise();
    await pool.request()
    .input('id_oferta',sql.Int,id)
    .input('id_empresa',sql.Int,id_empresa)
    .input('titulo',sql.VarChar,titulo)
    .input('descripcion',sql.VarChar,descripcion)
    .input('ubicacion',sql.VarChar,ubicacion)
    .input('salario', sql.VarChar,salario)
    .query(' UPDATE ofertas SET id_empresa=@id_empresa, titulo=@titulo, descripcion=@descripcion, ubicacion=@ubicacion, salario=@salario WHERE id_oferta=@id_oferta');
    return res.status(200).json({message:'oferta actualizada'})
} catch (error) {
    console.error('error no se pudo actualizar oferta');
    return res.status(500).json({message:'error en el servidor',error:error.message});
}
}

const deleteoferta = async (req,res) =>{
const {id} = req.params;

try {
    const pool = await poolpromise();
    const result = await pool.request()
    .input('id_oferta', sql.Int,id)
    .query('DELETE FROM ofertas WHERE id_oferta=@id_oferta');
    if (result.rowsAffected[0]=== 0) {
        return res.status(400).json({message:'oferta no encontrada'})
    }
    return res.status(204).json({message:'oferta eliminada'})
    
} catch (error) {
    console.error('error al eliminar',error);
    return res.status(500).json({message:'error en el servidor',error:error.message})
}


}



module.exports ={getoferta,postoferta,putoferta,deleteoferta}