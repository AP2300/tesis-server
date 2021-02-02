const db = require('./../../connections/Dbconnection');
const bcrypt = require('bcryptjs');

exports.user = function (id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT nombre, email, roles_id FROM usuarios WHERE id = ?', [id], (error, result) => {

      if (error) {
        console.log('error en obtener data', error.stack);
        return reject('Error')
      }
      resolve(result[0]);

    })
  })
}

exports.users = function () {
  return new Promise((resolve, reject) => {
    db.query('SELECT usuarios.*, roles.nombre as rol FROM usuarios INNER JOIN roles ON roles.id=usuarios.roles_id', (error, result) => {

      if (error) {
        console.log('error en obtener data', error.stack);
        return reject('Error')
      }

      resolve(result);

    })
  })
}

exports.DelUser = function (id) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM usuarios WHERE id=?', [id], (error, result) => {

      if (error) {
        console.log('error al eliminar usuario', error.stack);
        return reject('Error')
      }

      resolve(result);

    })
  })
}

exports.userInfo = function (id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT usuarios.*, roles.nombre AS rol FROM usuarios INNER JOIN roles ON roles.id=usuarios.roles_id WHERE usuarios.id=?', [id], (error, result) => {

      if (error) {
        console.log('error en obtener data', error.stack);
        return reject('Error')
      }

      resolve(result[0]);

    })
  })
}

exports.editUser = function (data, id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT email FROM usuarios WHERE NOT id=? AND email=?', [id, data.email], (error, result) => {
      if (error) {
        console.log('error en obtener data', error.stack);
        return reject('Error al actualizar')
      }
      if(result.length > 0) {
        return reject("El email seleccionado ya existe");
      } else {
        bcrypt.hash(data.clave, 8, function(err, hash) {
          db.query('UPDATE usuarios SET ? WHERE id=?', [{
            nombre: data.nombre,
            doc_identidad: data.doc_identidad,
            num_contacto: data.num_contacto,
            fecha_nacimiento: data.fecha_nacimiento,
            email: data.email,
            direccion:data.direccion,
            clave:hash,
            roles_id:data.roles_id
          }, id], (error, result) => {

            if (error) {
              console.log('error en obtener data', error.stack);
              return reject('Error al actualizar')
            }
      
            resolve("Usuario actualizado satisfactoriamente");
      
          })
        })
      }
        
    })
  })
}