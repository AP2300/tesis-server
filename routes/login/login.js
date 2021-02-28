const DB = require('../../connections/Dbconection');

exports.login = (email) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT IDUser, FullName ,Email, Password FROM users WHERE Email= ?', [email], (err,res) =>{
            if(err){
                console.error('Ha ocurrido un error al solicitar data', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            resolve(res[0])
        })
    })
};