const DB = require('../../connections/Dbconection');
const bcrypt = require('bcryptjs');
const { reject } = require('lodash');

exports.GetData = (email) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM users WHERE Email= ?', [email], (err, res) => {
            if (err) {
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
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM records WHERE IDUser = ?', [id], (err, res) => {
            if (err) {
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

exports.getUsersData = () => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT FullName, Email, IDUser FROM users", (err, res) => {
            if (err) {
                console.error("error al obtener los datos", err.stack)
                return reject({
                    query: false,
                    msg: "error al recuperar los datos"
                })
            }
            resolve(res)
        })
    })
}


exports.getAccess4History = (id) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM records WHERE IDUser = ?', [id], (err, res) => {
            if (err) {
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

exports.getFullUserData = (id) => {
    return new Promise((resolve, reject) => {
        DB.query(`SELECT security.Name, biometrics.IsActive, biometrics.IDBiometrics, biometrics.IDSecurity
        FROM users 
        INNER JOIN biometrics ON biometrics.IDUser = users.IDUser 
        INNER JOIN security ON security.IDSecurity = biometrics.IDSecurity 
        WHERE users.IDUser = ? `, [id], (err, res) => {
            if (err) {
                console.error("error al recuperar los datos del usuario", err)
                reject({
                    query: false,
                    msg: "error al recuperar los datos del ususario"
                })
            }
            resolve(res)
        })  
    })
}
exports.updateData = (Data, id) => {
    return new Promise((resolve, reject) => {
        DB.query('UPDATE users SET FullName = ?, Email = ? WHERE IDUser = ?', [Data.name, Data.email, id], (err, res) => {
            if (err) {
                console.error("Error al Actualizar los datos", err.stack)
                return reject({
                    query: false,
                    msg: "Ha ocurrido un error al actualizar los datos"
                })
            }
            resolve(res)
        })
    })
}

exports.updatePassword = (Data, id) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT Password FROM users WHERE IDUser = ?', [id], (erro, res) => {
            if (erro) {
                console.error('Ocurrio un error al solicitar datos', erro.stack);
                return reject({
                    query: false,
                    msg: "Ha ocurrido un error al registrar el Usuario"
                })
            } else {
                if (res[0]) {
                    if (res[0].Password) {
                        bcrypt.compare(Data.OldPass, res[0].Password).then((res) => {
                            if (res === true) {
                                bcrypt.hash(String(Data.Password), 8, (error, hash) => {
                                    if (error) {
                                        console.error("Hubo un error en el Hash", error);
                                    } else {
                                        DB.query('UPDATE users SET Password = ? WHERE IDUser = ?', [hash, id], (err, res) => {
                                            if (err) {
                                                console.error("Error al Actualizar los datos", err.stack)
                                                return reject({
                                                    query: false,
                                                    msg: "Ha ocurrido un error al actualizar los datos"
                                                })
                                            }
                                            resolve(res)
                                        })
                                    };
                                });
                            } else {
                                resolve({ OldPass: false })
                            }
                        })
                    } else {
                        return reject({
                            query: false,
                            msg: "Este Usuario no Existe!"
                        })
                    }
                } else {
                    return reject({
                        query: false,
                        msg: "Este Usuario no Existe!"
                    })
                }
            }
        })
    })
}

exports.UpdateAuth = (id,active) =>{
    return new Promise((resolve, reject)=>{
        DB.query('UPDATE biometrics SET IsActive = ? WHERE IDSecurity = ?',[active, id], (err, res)=>{
            if(err){
                console.error("error al actualizar los datos biometricos", err.stack)
                return reject({
                    query: false,
                    msg: "ocurrio un error al actualizar los datos"
                })
            }else resolve(res)
        })
    })
}