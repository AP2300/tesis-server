const DB = require('../../connections/Dbconection');


exports.GetData = (email) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM users WHERE Email= ?', [email], (err, res) => {
            if (err) {
                console.error('Ha ocurrido un error al solicitar data', err.stack);
                return reject({
                    query: false,
                    msg: 'Ha ocurrido un error en el login'
                })
            }
            resolve(res[0])
        })
    });
};

exports.getAccess = (id) => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM records WHERE IDUser = ?', [id], (err, res) => {
            if (err) {
                console.error("error al solicitar los datos", err.stack)
                return reject({
                    query: false,
                    msg: "ha ocurrido un error al recuperar el acceso"
                })
            }
            resolve(res)
        })
    })
}

exports.getUsersData = () => {
    return new Promise((resolve, reject) => {
        DB.query("SELECT FullName, Email, IDUser FROM users", (err, res) => {
            if (err) {
                console.error("error al obtener los datos", err.stack)
                return reject({
                    query: false,
                    msg: "error al recuperar los datos"
                })
            }
            resolve(res)
        })
    })
}


exports.getAccess4History = () => {
    return new Promise((resolve, reject) => {
        DB.query('SELECT * FROM records', (err, res) => {
            if (err) {
                console.error("error al solicitar los datos", err.stack)
                return reject({
                    query: false,
                    msg: "ha ocurrido un error al recuperar el acceso"
                })
            }
            resolve(res)
        })
    })
}