const   DB = require('../../connections/Dbconection pruebas');

exports.setRecord = (id) => {
    return new Promise((resolve, reject) => {
        DB.query('INSERT INTO records (IDUser, TypeAction) VALUES (?, "E")', id, (err, res) => {
            if (err) {
                console.error('Ha ocurrido un error al hacer el registro', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al hacer el registro'
                })
            }

            return resolve({
                query: true,
                msg: 'Exito'
            })
        })
    })
};