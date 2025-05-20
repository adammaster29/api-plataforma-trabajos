const { poolpromise, sql } = require("../conf/config");
const express = require('express');


const getcandidato = async (req,res)=>{
try {
    const pool = await  poolpromise();
    const result = await pool.request()
    .query(' SELECT  u.nombre , u.email , u.id_rol, u.fecha_registro,c.id_candidato, c.experiencia,c.educacion,c.hoja_vida FROM candidatos c JOIN usuarios u ON c.id_usuario = u.id_usuario ')
  return   res.status(200).json(result.recordset)

} catch (error) {
    console.log('error al obtener candidato')
    res.status(500).json({message:'error al traer los usuarios'})
}

}


const postcandidato = async (req,res) => {
const {id_usuario,experiencia,educacion} = req.body;
  const hoja_vida = req.file ? req.file.filename : null;
if (!id_usuario || !experiencia || !educacion || !hoja_vida ) {
  return res.status(400).json({message:'datos vacios por favor llenar todos los campos'})
}

try {
  const pool = await poolpromise();
  await pool.request()
  .input('id_usuario', sql.Int , id_usuario)
  .input('experiencia', sql.VarChar, experiencia)
  .input('educacion', sql.VarChar, educacion)
  .input('hoja_vida', sql.VarChar, hoja_vida)
  .query('INSERT INTO candidatos(id_usuario,experiencia,educacion,hoja_vida) VALUES(@id_usuario, @experiencia, @educacion, @hoja_vida)');
  return res.status(200).json({message:'candidato creado'})
} catch (error) {
  console.log('error al crear candidatos',error);
    return res.status(500).json({message:'error al crear candidato ',error:error.message})
}
}

const putcandidato = async (req,res) => {

const {id} = req.params;
const {experiencia,educacion} = req.body;
if (!experiencia || !educacion) {
  return res.status(400).json('error hay campos vacios');
}
const pool = await poolpromise();
try {
  await pool.request()
.input('id_candidato', sql.Int, id)
.input('experiencia', sql.VarChar, experiencia)
.input('educacion', sql.VarChar, educacion)
.query(' UPDATE candidatos SET  experiencia=@experiencia ,educacion=@educacion WHERE id_candidato=@id_candidato');
return res.status(200).json({message:'candidato actualizado'});
} catch (error) {
  console.error('error al actualizar',error);
  return res.status(500).json({message:'error al actualizar problema en el servidor',error:error.message})
}

}



const deletecandidato = async (req,res) =>{
  const {id} = req.params;
  
  try {
    const pool = await poolpromise();
    const result = await pool.request()
    .input('id_candidato', sql.Int, id)
    .query(' DELETE FROM candidatos  WHERE id_candidato=@id_candidato')
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
      
    }
    return res.status(204).json({message:'candidato eliminado'})
  } catch (error) {
    console.error('error al eliminar',error)
    return res.status(500).json({message:'error candidato no eliminado',error:error.message})
  }
}


module.exports={getcandidato,postcandidato,putcandidato,deletecandidato}