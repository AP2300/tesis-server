const { isNull } = require('lodash');
const DB = require('../../connections/Dbconection pruebas');

exports.login = (email) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT IDUser, FullName ,Email, Password, IsActive FROM users WHERE Email= ?', [email], (err, res) => {
            if (err) {
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

exports.logOut = (id) => {
    return new Promise((resolve, reject) => {
        DB.query(`ALTER EVENT event_User_? DISABLE`, [id], (err, response) => {
            if (err) {
                console.error('Ha ocurrido un error al solicitar data', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            DB.query("UPDATE `users` SET `Session` = NULL WHERE `users`.`IDUser` = ?", [id], (error, re) => {
                if (error) {
                    console.error('Ha ocurrido un error al solicitar data', error.stack);
                    return reject({
                        query: false,
                        msg: 'Ha ocurrido un error en el login al alterar session en el usuario'
                    })
                }
                resolve(true)
            })
        })
    })
}

exports.ActiveSession = (id,token) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT Session FROM users WHERE IDUser = ?', [id], (er, res) => {
            if (er) {
                console.error('Ha ocurrido un error al solicitar data', er.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            if (!isNull(res[0].Session)) {
                return resolve(false);
            } else {
                DB.query("UPDATE `users` SET `Session` = ? WHERE `users`.`IDUser` = ?", [token, id], (error, re) => {
                    if (error) {
                        console.error('Ha ocurrido un error al solicitar data', error.stack);
                        return reject({
                            query: false,
                            msg: 'Ha ocurrido un error en el login al alterar session en el usuario'
                        })
                    }
                    DB.query(`ALTER EVENT event_User_? ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 5 MINUTE ENABLE`, [id], (err, response) => {
                        if (err) {
                            console.error('Ha ocurrido un error al solicitar data', err.stack);
                            return reject({
                                query: false,
                                msg: 'Ha ocurrido un error en el login al alterar el evento'
                            })
                        }
                        DB.query(`SET GLOBAL event_scheduler="ON"`, (e, response) => {
                            if (e) {
                                console.error('Ha ocurrido un error al solicitar data', e.stack);
                                return reject({
                                    query: false,
                                    msg: 'Ha ocurrido un error en el login al Activar los evento'
                                })
                            }
                            resolve(true)
                        })
                    })
                })
            }
        })
    })
}

exports.CheckIfActive = (id, token) =>{
    return new Promise((resolve, reject)=>{
        DB.query('SELECT Session FROM users WHERE IDUser = ?', [id], (err, res)=>{
            if(err){
                console.error(err)
                return reject({
                    query: false,
                    msg: 'error comprobando al ususario'
                })
            }
            if(res[0].Session === token){
                return resolve(true);
            }else{
                DB.query(`ALTER EVENT event_User_? DISABLE`, [id], (err, response) => {
                    if (err) {
                        console.error('Ha ocurrido un error al solicitar data', err.stack);
                        return reject({
                            query: false,
                            msg: 'Ha ocurrido un error en el checkSession'
                        })
                    }
                    DB.query("UPDATE `users` SET `Session` = NULL WHERE `users`.`IDUser` = ?", [id], (error, re) => {
                        if (error) {
                            console.error('Ha ocurrido un error al solicitar data', error.stack);
                            return reject({
                                query: false,
                                msg: 'Ha ocurrido un error en el checkSession al alterar session en el usuario'
                            })
                        }
                        resolve(false)
                    })
                })
        
            }
        })
    })
}