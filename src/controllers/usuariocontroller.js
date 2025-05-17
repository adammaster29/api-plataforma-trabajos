const { poolpromise, sql } = require("../conf/config")
const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt')
// login            --------------------  get
// obtener user     --------------------  get
//  paginacion      --------------------  get
// agregar usuario  --------------------  post
// editar usuario   --------------------  put
// elminar usuario  --------------------  delete



const login= async (req,res)=>{
const {email,contraseña} = req.body
if (!email || !contraseña) {
   return  res.status(400).json({message:'error campos vacios'})
}

try {
    const pool = await poolpromise();
    const result = await pool.request()
    .input('email', sql.VarChar,email )
    .query('SELECT  * FROM usuarios WHERE email=@email')
    
    const user = result.recordset[0];

    if (!user) {
      return  res.status(404).json({message:'usuario no encontrado '})
    }



const isMatch = await bcrypt.compare(contraseña,user.contraseña)
if (!isMatch) {
  return  res.status(404).json({message:'contraseña incorrecta '})
}


 const rolResult = await pool.request()
            .input('id_rol', sql.Int, user.id_rol)
            .query('SELECT nombre FROM roles WHERE id_rol = @id_rol');

        const rol = rolResult.recordset[0];


   //  token JWT
        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                email: user.email,
                rol: rol ? rol.nombre : 'Desconocido', 
            },
            process.env.BD_JWT, 
            { expiresIn: '2h' }
        );

        
        res.status(200).json({
            message: 'Login exitoso.',
            token,
            usuario: {
                id: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                rol: rol ? rol.nombre : 'Desconocido' 
            }
        });




} catch (error) {
    console.error('Error al hacer login:', error);
     return   res.status(500).json({ message: 'Error en el servidor.' });
}

}

const getusuario= async (req,res)=>{

    try {
        const pool = await poolpromise();
                                                                                                                                                  
    const  result  = await pool.request().query('SELECT  r.nombre AS rol ,u.id_usuario,u.nombre,u.email,u.contraseña,fecha_registro FROM usuarios u JOIN roles r ON  u.id_rol= r.id_rol ')
        
            res.status(200).json(result.recordset);

    } catch (error) {
        console.error('error al obtener usuarios',error)
       return  res.status(500).json({message:'error al obtener los usuarios',error:error.message})
    }
}

const getUsuariosPaginados = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const pool = await poolpromise();

    // 1. Obtener usuarios paginados
    const usuariosResult = await pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT *
        FROM usuarios
        ORDER BY id_usuario
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY;
      `);

    // 2. Obtener total de registros
    const totalResult = await pool.request()
      .query(`SELECT COUNT(*) AS total FROM usuarios;`);

    const total = totalResult.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      data: usuariosResult.recordset,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Error al obtener usuarios paginados:', error);
    return res.status(400).json({
      message: 'Error en la paginación',
      error: error.message
    });
  }
};

const postusuario = async (req,res)=>{
  
const {nombre,email,contraseña,id_rol} = req.body
if (!nombre || !email || !contraseña || !id_rol) {
    res.status(400).json({message:'agregar todos los campos, Hay  vacios '})
}
try {
    const pool = await poolpromise();
    const hashedPassword = await bcrypt.hash(contraseña,10);
    const result = await pool.request()
        .input('email', sql.VarChar, email)
    .query('SELECT * FROM usuarios  WHERE email = @email');
if (result.recordset.length > 0) {
        return res.status(400).json({message:'este correo esta registrado ya'});
}

    await pool.request()
    .input('nombre', sql.VarChar, nombre)
    .input('email', sql.VarChar, email)
    .input('contraseña', sql.VarChar, hashedPassword)
    .input('id_rol', sql.Int, id_rol)
    .query('INSERT INTO usuarios  (nombre,email,contraseña,id_rol) VALUES (@nombre,@email,@contraseña,@id_rol)'  )

   return  res.status(201).json({message:'usuario agregado'})
} catch (error) {
    console.error('error al crear usuario',error);
    return res.status(400).json({message:'error al crear un nuevo usuario',error:error.message})
}

}


const putusuario = async (req,res) => {
const {id} = req.params
const {nombre,email,contraseña,id_rol} = req.body
if (!nombre || !email || !contraseña || !id_rol){
    return res.status(400).json({message:'error  campos vacios'})
}
try {

    const pool = await poolpromise();

  const result = await pool.request()
  .input('email',sql.VarChar,email)
  .input('id', sql.Int, id)
  .query('SELECT 1 FROM usuarios WHERE email=@email AND id_usuario != @id')
  
    if (result.recordset.length > 0) {
       return res.status(400).json({ message: 'El correo ya está en uso por otro usuario.' }); 
      }


    const hashedPassword = await bcrypt.hash(contraseña,10)
    await pool.request()
    .input('id_usuario',sql.Int,id)
    .input('nombre',sql.VarChar,nombre)
    .input('email',sql.VarChar, email)
    .input('contraseña',sql.VarChar,hashedPassword)
    .input('id_rol',sql.Int,id_rol)
    .query('UPDATE usuarios  SET nombre=@nombre, email=@email, contraseña=@contraseña, id_rol=@id_rol WHERE id_usuario=@id_usuario')
    
    return res.status(200).json({message:'usuario actualizado'})

} catch (error) {
    console.error('error al actualizar',error);
    return res.status(500).json({message:'error al actualizar los usuarios',error:error.message})
}
}

const deleteusuario = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolpromise();
    const result = await pool.request()
      .input('id_usuario', sql.Int, id)
      .query('DELETE FROM usuarios WHERE id_usuario = @id_usuario');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario borrado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(400).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};



module.exports = {getusuario,login,postusuario,putusuario,deleteusuario,getUsuariosPaginados}