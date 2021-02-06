const DB = require('../../config/DB_conecction');
const bcrypt = require('bcryptjs')

exports.GetData = (email) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT name, email FROM users WHERE email= ?', [email], (err,res) =>{
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