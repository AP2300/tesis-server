const db = require('./../../connections/Dbconnection');
const bcrypt = require("bcryptjs");



exports.register = function(data) {
  return new Promise((resolve, reject) => {
      db.query("SELECT * FROM usuarios WHERE email = ?", [data.email], (error,resultS)=>{
          if(error){
              console.log(error)
              resolve( {
                success:false,
                msg:"Ha ocurrido un error en el registro"
              })
          }else{
              if(resultS[0]){
                  if(resultS[0].email){
                    resolve ({success:false,
                      msg:"Este correo ya posee una cuenta asociada"})
                  }
                  if(resultS[0].doc_identidad){
                    resolve ({success:false,
                      msg:"Este documento de identidad ya posee una cuenta asociada"})
                  }

              }else{
                bcrypt.hash(data.clave, 8, function(err, hash) {
                  console.log(data.rol);
                  db.query(`INSERT INTO usuarios SET ?`,[{
                    nombre: data.nombre,
                    doc_identidad: data.doc_identidad,
                    num_contacto: data.num_contacto,
                    fecha_nacimiento: data.fecha_nacimiento,
                    email: data.email,
                    direccion:data.direccion,
                    clave:hash,
                    roles_id:data.rol
                  }], (error, resultI) => {
                    if(error) {
                      console.log('error en el register', error.stack);
                      return reject({
                        success: false,
                        msg: "error al registrar el usuario"
                      })
                    }else{
                      db.query("INSERT INTO carrito SET ?", [{id_usuario:resultI.insertId}], (err, resultLI)=>{
                        if(err){
                          console.log(err);
                          reject("error al crear el carrito")
                        }else{
                          resolve({
                            success:true,
                            msg:"Usuario regsistrado satisfactoriamente"
                          });
                        }
                      })
                    }
                  })
                });
              }
          }
        })
    })
    .catch(error=>{
        console.log(error);
        return {
            success:false,
            msg: "Error en registro"
        }
    })
}
