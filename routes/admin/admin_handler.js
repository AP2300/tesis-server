const token = require('../../models/token');
const admin = require('./admin');

/**
 * 
 * @param {object} req con la informacion para actualizar un usuario
 * @returns un objeto con un mensaje de estado
 */

module.exports.UpdateDataAdmin = (req, res) => {
    const data = req.body;

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
        .catch(err =>{
            console.error("Error al eliminar el usuario",err);
            res.send({
                success: false,
                msg: "error al eliminar el usuario"
            })
        })
}

/**
 * 
 * @param {object} req con la informacion para actualizar la clave de un usuario
 * @returns un objeto con un mensaje de estado
 */

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

/**
 * 
 * @param {object} req con el estado del usuario para actualizarlo
 * @returns un objeto con un mensaje de estado
 */

module.exports.UserStateUpdate = (req, res) => {
    const data = req.body
    admin.ChangeState(data)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    msg: "hubo un error actualizando el estado"
                })
            } else {
                return res.send({
                    success: true,
                    msg: "estado actualizado correctamente"
                })
            }
        })
}

/**
 * 
 * @param {object} req con el id del usuario a eliminar
 * @returns un objeto con un mensaje de estado
 */

module.exports.DeleteUser = (req, res) => {
    const {id} = req.body
    admin.deleteUser(id)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    msg: "hubo un error eliminando el usuario"
                })
            } else {
                return res.send({
                    success: true,
                    msg: "usuario eliminado correctamente"
                })
            }
        })
}