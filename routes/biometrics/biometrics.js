const DB = require('../../connections/Dbconection');

exports.setFace = (face, id) => {
    console.log("Empezo")
    return new Promise( (resolve, reject) =>{
        console.log(":O")
        DB.getConnection(function(err, conn) {
            conn.beginTransaction(function(err) {
                console.log("Inicio transaccion")
                if (err) { 
                    console.error('Ha ocurrido un error al solicitar data', err.stack);
                    return conn.rollback(function() {
                        return reject({
                            query: false,
                            msg: 'Ha ocurrido un error al registrar la cara'
                        })
                    });
                }
                conn.query('SELECT biometrics.IDSecurity, Name, data from biometrics inner join security on biometrics.IDSecurity = security.IDSecurity where biometrics.IDUser = ? AND biometrics.IDSecurity = 3', id, function (error, results, fields) {
                    console.log("Primer query");
                    if (error) {
                        return conn.rollback(function() {
                            console.error('Ha ocurrido un error al solicitar data', err.stack);
                            return conn.rollback(function() {
                                return reject({
                                    query: false,
                                    msg: 'Ha ocurrido un error al registrar la cara'
                                })
                            });
                        });
                    } else if (results.length == 0) {
                        conn.query('INSERT INTO biometrics SET ?', {IDSecurity: 3, IDUser: id, data: face}, (err ,res, fields) =>{
                            console.log("segundo query")
                            if(err){
                                console.error('Ha ocurrido un error al solicitar data', err.stack);
                                return conn.rollback(function() {
                                    return reject({
                                        query: false,
                                        msg: 'Ha ocurrido un error al registrar la cara'
                                    })
                                });
                            } else {
                                conn.commit(function(err) {
                                    if (err) {
                                        console.error('Ha ocurrido un error al solicitar data', err.stack);
                                        return conn.rollback(function() {
                                            return reject({
                                                query: false,
                                                msg: 'Ha ocurrido un error al registrar la cara'
                                            })
                                        });
                                    }
                                    console.log('success setting face!');
                                    return resolve({
                                        query: true,
                                        msg: 'Exito',
                                        data: res[0]
                                    });
                                });
                            }
                        })
                    } else {
                        conn.query('UPDATE biometrics SET ? WHERE IDUser = ? AND IDSecurity = ?', [{data: face}, id, 3], function (error, res, fields) {
                            console.log("Primer query else")
                            if (error) {
                                console.error('Ha ocurrido un error al solicitar data', err.stack);
                                return conn.rollback(function() {
                                    return reject({
                                        query: false,
                                        msg: 'Ha ocurrido un error al registrar la cara'
                                    })
                                });
                            }
                            conn.commit(function(err) {
                                if (err) {
                                    console.error('Ha ocurrido un error al solicitar data', err.stack);
                                    return conn.rollback(function() {
                                        return reject({
                                            query: false,
                                            msg: 'Ha ocurrido un error al registrar la cara'
                                        })
                                    });
                                }
                                console.log('success!');
                                return resolve({
                                    query: true,
                                    msg: 'Exito',
                                    data: res[0]
                                });
                            });
                        });
                    }
                });
            });        
        })
    });
};

exports.getFace = (id) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT data FROM biometrics WHERE IDUsers = ? AND IDSecurity = ?', [id, 3], (err,res) =>{
            if(err){
                console.error('Ha ocurrido un error al solicitar la imagen', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al obtener la imagen facial'
                })
            } else {
                return resolve({
                    query: true,
                    data: res[0],
                    msg: "Exito"
                })
            }
        })
    })
};