const DB = require('../../connections/Dbconection');
const bcrypt = require('bcryptjs');

exports.UpdateData = (data) => {
    return new Promise((resolve, reject) => {
        DB.query("UPDATE users SET FullName = ?, Email = ?  WHERE IDUser = ?", [ data.name, data.email, Number(data.id)], (err, res) => {
            if (err) {
                console.error("Ocurrio un errror al actualizar datos por administrador", err.stack)
                return reject({
                    query: false,
                    msg: "Error al actualizar datos"
                })
            }
            resolve(res)
        })
    })
}

exports.UpdatePass = (data) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(String(data.pass), 8, (error, hash) => {
            if (error) console.error("Hubo un error en el Hash", error);
            else {
                DB.query("UPDATE users SET Password = ? WHERE IDUser = ? ", [hash, data.id], (err, res) => {
                    if (err) {
                        console.error("Ocurrio un error al actualizar la contraseña por administrador");
                        return reject({
                            query: false,
                            msg: "error al actualizar la contraseña"
                        })
                    }
                    resolve(res)
                })
            }
        })

    })
}

exports.ChangeState = data =>{
    return new Promise((resolve, reject)=>{
        DB.query("UPDATE users SET IsActive = ? WHERE IDUser = ?", [data.state, data.id], (err, res)=>{
            if(err){
                console.error("Error al cambiar el estado del usuario");
                return reject({
                    query: false,
                    msg: "no se pudo actualizar el estado del usuario"
                })
            }
            resolve(res)
        })
    })
}