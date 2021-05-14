const DB = require('../../connections/Dbconection pruebas');
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890', 6)
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
                                [data.name, data.email, hash, data.type], async (err, result) => {
                                    if (err) {
                                        console.log('Error en el Registro', err.stack);
                                        return reject('Error en el Registro');
                                    } else {
                                        const code = await nanoid()
                                        DB.query('INSERT INTO biometrics SET ?',
                                            { IDSecurity: 1, IDUser: result.insertId, data: code, IsActive: 1 }, (er, res) => {
                                                if (er) {
                                                    console.log('Error en el Registro', err.stack);
                                                    return reject('Error en el Registro');
                                                }
                                                DB.query('CREATE EVENT event_User_? ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 MINUTE ON COMPLETION PRESERVE DO UPDATE `users` SET `Session` = NULL WHERE `users`.`IDUser` = ?',
                                                    [result.insertId, result.insertId], (e, response) => {
                                                        if (er) {
                                                            console.log('Error en el Registro al crear el evento', err.stack);
                                                            return reject('Error en el Registro al crear el evento');
                                                        }
                                                        resolve({
                                                            query: true,
                                                            msg: 'El Usuario ha sido Registrado Satisfactoriamente',
                                                            Inserted: result.insertId
                                                        });
                                                    })
                                            })
                                    }

                                });
                        };
                    });
                };
            };
        });
    });
};