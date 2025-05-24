const { poolpromise, sql } = require('../conf/config');





const postnotificacion = async (req, res) => {
  const { id_candidato, id_oferta } = req.body;

  try {
    const pool = await poolpromise();

    // 1. Insertar la postulación
    await pool.request()
      .input('id_candidato', sql.Int, id_candidato)
      .input('id_oferta', sql.Int, id_oferta)
      .query(`
        INSERT INTO Postulaciones (id_candidato, id_oferta)
        VALUES (@id_candidato, @id_oferta)
      `);

    // 2. Obtener el id_usuario de la empresa que publicó la oferta
    const result = await pool.request()
      .input('id_oferta', sql.Int, id_oferta)
      .query(`
        SELECT u.id_usuario FROM ofertas o
        JOIN empresas e ON o.id_empresa = e.id_empresa
        JOIN usuarios u ON e.id_usuario = u.id_usuario
        WHERE o.id_oferta = @id_oferta
      `);

    const id_usuario = result.recordset[0]?.id_usuario;

    // 3. Insertar notificación
    if (id_usuario) {
      await pool.request()
        .input('id_usuario', sql.Int, id_usuario)
        .input('mensaje', sql.NVarChar, 'Un candidato se ha postulado a tu oferta.')
        .query(`
          INSERT INTO notificaciones (id_usuario, mensaje)
          VALUES (@id_usuario, @mensaje)
        `);
    }

    res.status(201).json({ mensaje: 'Postulación creada y notificación enviada.' });

  } catch (error) {
    console.error('Error en postnotificacion:', error);
    res.status(500).json({ error: 'Error al crear la postulación o enviar la notificación.' });
  }
};

const getNotificacion = async (req, res) => {
  const { id } = req.params; // recibes el id_usuario por URL

  try {
    const pool = await poolpromise();

    const result = await pool.request()
      .input('id_usuario', sql.Int, id)
      .query('SELECT * FROM notificaciones WHERE id_usuario = @id_usuario ORDER BY fecha DESC');

    res.status(200).json(result.recordset);

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener las notificaciones.' });
  }
};




module.exports = { postnotificacion,getNotificacion };
