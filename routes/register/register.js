const DB = require('../../config/DB_conecction');
const bcrypt = require('bcryptjs')

exports.register = (name, email, pass) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT email FROM users WHERE email=?', [email], (erro,res) =>{
            if(erro){
                console.error('Ocurrio un error al solicitar datos', erro.stack);
                return reject({
                    query: false,
                    msg:"Ha ocurrido un error al registrar el Usuario"
                })
            }else{
                if(res[0]){
                    if(res[0].email){
                        return reject ({
                            query: false,
                            msg:"El Correo ya se encuentra registrado!"
                        })
                    } 
                }else{
                    bcrypt.hash(String(pass), 8, (error,hash) =>{
                        if(error){
                            console.error("Hubo un error en el Hash", error);
                        }else{
                            DB.query('INSERT INTO users SET name=?, email=?, pass=?', [name,email,hash], (err,result) =>{
                                if(err){
                                    console.err('Error en el Registro', err.stack);
                                    return reject('Error en el Registro');
                                }
                                resolve({
                                    query: true,
                                    msg:'El Usuario ha sido Registrado Satisfactoriamente'
                                });
                            });
                        };
                    });
                };
            };
        });
    });
};