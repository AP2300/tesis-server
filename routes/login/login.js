const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require('../../connections/Dbconection');
const bcrypt = require("bcryptjs");

exports.login = function(email) {
  return new Promise( (resolve, reject) => {
    db.query(`SELECT usuarios.id, usuarios.email, usuarios.clave, roles.nombre AS rol
    FROM usuarios INNER JOIN roles ON roles.id = usuarios.roles_id
    WHERE usuarios.email = ?`,[email], (error, result) => {

      if(error) {
        console.log('error en el login', error.stack);
        return reject('Error en el login')
      }
      console.log(result[0]);
      resolve(result[0]);

    })
  })
}