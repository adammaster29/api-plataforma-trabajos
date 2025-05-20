const { poolpromise } = require("../conf/config")



const getRol = async (req,res) =>{

try {
    const pool = await poolpromise();
    const result = await pool.request()
    .query(' SELECT * FROM roles ' )
   return res.status(200).json(result.recordset)

} catch (error) {
    console.error('error al obtener roles',error);
    res.status(500).json({message:'error al obtener rol'})
}

}

module.exports = { getRol }