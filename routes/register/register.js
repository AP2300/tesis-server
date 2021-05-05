const DB = require('../../connections/Dbconection');
const bcrypt = require('bcryptjs')

exports.register = (data) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT Email FROM users WHERE Email=?', [data.email], (erro, res) => {
            if (erro) {
                console.error('Ocurrio un error al solicitar datos', erro.stack);
                return reject({
                    query: false,
                    msg: "Ha ocurrido un error al registrar el Usuario"
                })
            } else {
                if (res[0]) {
                    if (res[0].Email) {
                        return reject({
                            query: false,
                            msg: "el correo ya se encuentra registrado!"
                        })
                    }
                } else {
                    bcrypt.hash(String(data.pass), 8, (error, hash) => {
                        if (error) {
                            console.error("Hubo un error en el Hash", error);
                        } else {
                            DB.query('INSERT INTO users SET FullName=?, Email=?, Password=?, IsAdmin = ?',
                                [data.name, data.email, hash, data.type], (err, result) => {
                                    if (err) {
                                        console.log('Error en el Registro', err.stack);
                                        return reject('Error en el Registro');
                                    }
                                    resolve({
                                        query: true,
                                        msg: 'El Usuario ha sido Registrado Satisfactoriamente',
                                        Inserted: result.insertId
                                    });
                                });
                        };
                    });
                };
            };
        });
    });
};