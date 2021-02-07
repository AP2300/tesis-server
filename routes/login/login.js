const DB = require('../../connections/Dbconection');

exports.login = (username) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT id, username, password FROM users WHERE username= ?', [username], (err,res) =>{
            if(err){
                console.error('Ha ocurrido un error al solicitar data', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            console.log(res)
            resolve(res[0])
        })
    })
};