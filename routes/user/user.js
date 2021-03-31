const DB = require('../../connections/Dbconection');
const bcrypt = require('bcryptjs')

exports.GetData = (email) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT * FROM users WHERE Email= ?', [email], (err,res) =>{
            if(err){
                console.error('Ha ocurrido un error al solicitar data', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            resolve(res[0])
        })
    });
};

exports.getAccess = (id) => {
    return new Promise((resolve, reject)=>{
        DB.query('SELECT * FROM records WHERE IDUser = ?', [id], (err,res)=>{
            if(err){
                console.error("error al solicitar los datos", err.stack)
                return reject({
                    query: false,
                    msg: "ha ocurrido un error al recuperar el acceso"
                })
            }
            resolve(res)
        })
    })
}