const token = require('../../models/token');
const admin = require('./admin');



module.exports.UpdateDataAdmin = (req, res) => {
    const data = req.body
    admin.UpdateData(data)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Hubo un error al Editar su Información"
                })
            } else {
                return res.send({
                    success: true,
                    log: true,
                    msg: "Datos Actualizados con Exito!"
                })
            }
        })
}

module.exports.UpdatePassAdmin = (req, res) => {
    const data = req.body
    admin.UpdatePass(data)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Hubo un error al actualizar su contraseña"
                })
            } else {
                return res.send({
                    success: true,
                    log: true,
                    msg: "Contraseña Actualizados con Exito!"
                })
            }
        })
}

module.exports.UserStateUpdate = (req, res) => {
    const data = req.body
    console.log(data);
    admin.ChangeState(data)
        .then(data => {
            if(data === undefined){
                return res.send({
                    success: false,
                    msg: "hubo un error actualizando el estado"
                })
            }else{
                return res.send({
                    success: true,
                    msg: "estado actualizado correctamente"
                })
            }
        })
}