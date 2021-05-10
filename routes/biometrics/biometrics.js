const   DB = require('../../connections/Dbconection');

exports.setCode = (code, id) => {
    return new Promise((resolve, reject) => {
        DB.getConnection(function(err, conn) {
            conn.beginTransaction(function(err) {
                console.log("Inicio transaccion")
                if (err) { 
                    console.error('Ha ocurrido un error al solicitar data', err.stack);
                    return conn.rollback(function() {
                        return reject({
                            query: false,
                            msg: 'Ha ocurrido un error al registrar el codigo'
                        })
                    });
                }
                conn.query('SELECT biometrics.IDSecurity, Name, data from biometrics inner join security on biometrics.IDSecurity = security.IDSecurity where biometrics.IDUser = ? AND biometrics.IDSecurity = 1', id, function (error, results, fields) {
                    console.log("Primer query");
                    if (error) {
                        return conn.rollback(function() {
                            console.error('Ha ocurrido un error al solicitar data', err.stack);
                            return conn.rollback(function() {
                                return reject({
                                    query: false,
                                    msg: 'Ha ocurrido un error al registrar el codigo'
                                })
                            });
                        });
                    } else if (results.length == 0) {
                        conn.query('INSERT INTO biometrics SET ?', {IDSecurity: 1, IDUser: id, data: code, IsActive: 1}, (err ,res, fields) =>{
                            console.log("segundo query")
                            if(err){
                                console.error('Ha ocurrido un error al solicitar data', err.stack);
                                return conn.rollback(function() {
                                    return reject({
                                        query: false,
                                        msg: 'Ha ocurrido un error al registrar el codigo'
                                    })
                                });
                            } else {
                                conn.commit(function(err) {
                                    if (err) {
                                        console.error('Ha ocurrido un error al solicitar data', err.stack);
                                        return conn.rollback(function() {
                                            return reject({
                                                query: false,
                                                msg: 'Ha ocurrido un error al registrar el codigo'
                                            })
                                        });
                                    }
                                    console.log('success setting code!');
                                    return resolve({
                                        query: true,
                                        msg: 'Exito',
                                        data: res[0]
                                    });
                                });
                            }
                        })
                             
                    } else {
                        conn.query('UPDATE biometrics SET ? WHERE IDUser = ? AND IDSecurity = ?', [{data: code}, id, 1], function (error, res, fields) {
                            console.log("Primer query else")
                            if (error) {
                                console.error('Ha ocurrido un error al solicitar data', err.stack);
                                return conn.rollback(function() {
                                    return reject({
                                        query: false,
                                        msg: 'Ha ocurrido un error al registrar el codigo'
                                    })
                                });
                            }
                            conn.commit(function(err) {
                                if (err) {
                                    console.error('Ha ocurrido un error al solicitar data', err.stack);
                                    return conn.rollback(function() {
                                        return reject({
                                            query: false,
                                            msg: 'Ha ocurrido un error al registrar el codigo'
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
                    };
                });
            });        
        })
    });
}

exports.verifyCode = (code) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT data, IDUser FROM biometrics WHERE data = ?', code, (err, res) => {
            console.log(res);
            if(err) {
                console.error('Ha ocurrido un error al validar el codigo', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al validar el codigo'
                })
            } else if(res.length == 0) {
                return reject({
                    query: false,
                    msg: "El codigo es invalido" 
                })
            } else {
                return resolve({
                    query: true,
                    id: res[0].IDUser,
                    msg: "Exito"
                })
            }
        })
    })
}

exports.getCode = (id) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT data FROM biometrics WHERE IDUser = ? AND IDSecurity = ?', [id, 1], (err,res) =>{
            console.log(res[0].data);
            if(err){
                console.error('Ha ocurrido un error al solicitar la imagen', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al obtener el codigo'
                })
            } else {
                return resolve({
                    query: true,
                    data: res[0].data,
                    msg: "Exito"
                })
            }
        })
    });
}

exports.setFinger = (finger, id, fingerName) => {
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
                            msg: 'Ha ocurrido un error al registrar la foto'
                        })
                    });
                }
                conn.query('SELECT biometrics.IDSecurity, Name, data, IDBiometrics, fingerName from biometrics inner join security on biometrics.IDSecurity = security.IDSecurity where biometrics.IDUser = ? AND biometrics.IDSecurity = 2 AND biometrics.fingerName = ?', [id, fingerName], function (error, results, fields) {
                    console.log("Primer query");
                    console.log(results)
                    if (error) {
                        return conn.rollback(function() {
                            console.error('Ha ocurrido un error al solicitar data', err.stack);
                            return conn.rollback(function() {
                                return reject({
                                    query: false,
                                    msg: 'Ha ocurrido un error al registrar el dedo'
                                })
                            });
                        });
                    } else if (results.length == 0) {
                        conn.query('INSERT INTO biometrics SET ?', {IDSecurity: 2, IDUser: id, data: finger, IsActive: 1, fingerName}, (err ,res, fields) =>{
                            console.log("segundo query")
                            if(err){
                                console.error('Ha ocurrido un error al solicitar data', err.stack);
                                return conn.rollback(function() {
                                    return reject({
                                        query: false,
                                        msg: 'Ha ocurrido un error al registrar el dedo'
                                    })
                                });
                            } else {
                                conn.commit(function(err) {
                                    if (err) {
                                        console.error('Ha ocurrido un error al solicitar data', err.stack);
                                        return conn.rollback(function() {
                                            return reject({
                                                query: false,
                                                msg: 'Ha ocurrido un error al registrar el dedo'
                                            })
                                        });
                                    }
                                    console.log('success setting finger!');
                                    return resolve({
                                        query: true,
                                        msg: 'Exito',
                                        data: res[0]
                                    });
                                });
                            }
                        })
                    } else {
                        return reject({
                            query: false,
                            msg: 'Ya hay un dedo creado.',
                        });
                    }
                });
            });        
        })
    });
};

exports.getFinger = (id) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT data FROM biometrics WHERE IDUser = ? AND IDSecurity = ?', [id, 2], (err,res) =>{
            console.log(res[0].data);
            if(err){
                console.error('Ha ocurrido un error al solicitar la imagen', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al obtener la imagen del dedo'
                })
            } else {
                return resolve({
                    query: true,
                    data: res[0].data,
                    msg: "Exito"
                })
            }
        })
    })
};

exports.deleteMethod = (id) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT * FROM biometrics WHERE IDBiometrics = ?', id, (err,data) =>{
            console.log(data);
            if(err){
                console.error('Ha ocurrido un error al eliminar el metodo', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al eliminar el metodo'
                })
            } else {
                DB.query('DELETE FROM biometrics WHERE IDBiometrics = ?', id, (err,res) =>{
                    console.log(res);
                    if(err){
                        console.error('Ha ocurrido un error al eliminar el metodo', err.stack);
                        return reject({
                            query: false,
                            msg: 'Ha ocurrido un error al eliminar el metodo'
                        })
                    } else {
                        console.log(res)
                        return resolve({
                            query: true,
                            msg: "Exito",
                            data: data[0].data
                        })
                    }
                })
            }
        })
        
    })
};

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
                        conn.query('INSERT INTO biometrics SET ?', {IDSecurity: 3, IDUser: id, data: face, IsActive: 1}, (err ,res, fields) =>{
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
                        return reject({
                            query: false,
                            msg: 'Ya hay una imagen facial registrada'
                        })
                    }
                });
            });        
        })
    });
};

exports.getFace = (id) => {
    return new Promise( (resolve, reject) =>{
        DB.query('SELECT data FROM biometrics WHERE IDUser = ? AND IDSecurity = ?', [id, 3], (err,res) =>{
            console.log(res[0].data);
            if(err){
                console.error('Ha ocurrido un error al solicitar la imagen', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error al obtener la imagen facial'
                })
            } else {
                return resolve({
                    query: true,
                    data: res[0].data,
                    msg: "Exito"
                })
            }
        })
    })
};