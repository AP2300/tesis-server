const Token = require("../../models/token")
const user = require('./user');
var _ = require('lodash');
var moment = require('moment'); // require
moment().format();

module.exports.GetUserData = async (req, res) => {
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);

    user.GetData(decode.email)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Usted No esta Autenticado"
                })
            }
            else {
                return res.send({
                    success: true,
                    data: data,
                    id: decode.id,
                    log: true,
                    msg: "Usuario Autenticado"
                })
            }
        })
        .catch(err => {
            console.error(err);
            return res.send({
                succes: false,
                msg: "No esta autenticado, hubo un error"
            })
        })
}

module.exports.GetUserAccess = async (req, res) => {
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);

    user.getAccess(decode.id)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Usted No esta Autenticado"
                })
            }
            else {
                let groupedResults = _.groupBy(data, (data) => moment(data.RegDate, 'DD/MM/YYYY').startOf('isoWeek'))
                result = Object.entries(groupedResults)
                return res.send({
                    success: true,
                    data: result[1],
                    id: decode.id,
                    log: true,
                    msg: "Usuario Autenticado"
                })
            }
        })
        .catch(err => {
            console.error(err);
            return res.send({
                succes: false,
                msg: "No esta autenticado, hubo un error"
            })
        })
}

module.exports.GetUsersData = async (_, res) => {
    user.getUsersData()
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    msg: "error al recuperar los usuarios",
                })
            } else {
                return res.send({
                    success: true,
                    msg: "datos recuperados",
                    data: data
                })
            }
        })
}

module.exports.GetUserHistoryData = async (req, res) => {
    console.log(req.query, req.params);
    user.getAccess4History(req.query.id)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    msg: "Error el usuario no posee historial"
                })
            } else {
                return res.send({
                    success: true,
                    data: data,
                })
            }
        })
}
module.exports.UpdateData = async (req, res) => {
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const Data = req.body.Data;
    const ChangePass = req.body.changePass;

    user.updateData(Data, decode.id)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Hubo un error al Editar su Información"
                })
            }
            else {
                return res.send({
                    success: true,
                    data: data,
                    id: decode.id,
                    log: true,
                    msg: "Datos Actualizados con Exito!"
                })
            }
        })
        .catch(err => {
            console.error(err);
            return res.send({
                succes: false,
                msg: "No fueron actualizados sus datos, hubo un error"
            })
        })
}

module.exports.UpdatePassword = async (req, res) => {
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const Data = req.body.Data;

    user.updatePassword(Data, decode.id)
        .then(data => {
            if (data === undefined) {
                return res.send({
                    success: false,
                    log: false,
                    msg: "Hubo un error al Editar su Clave"
                })
            }
            else if (data.OldPass === false) {
                return res.send({
                    success: false,
                    id: decode.id,
                    log: true,
                    msg: "La Clave Antigua no Coincide"
                })
            }
            else {
                return res.send({
                    success: true,
                    data: data,
                    id: decode.id,
                    log: true,
                    msg: "Datos y Clave Actualizada con Exito!"
                })
            }
        })
        .catch(err => {
            console.error(err);
            return res.send({
                success: false,
                msg: "No fue actualizada su Clave, hubo un error"
            })
        })
}

module.exports.GetProfileData = async (req, res) => {
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    user.getFullUserData(decode.id)
        .then(data => {
            if(data===undefined){
                return res.send({
                    success: false,
                    msg: "error en la peticion"
                })
            }else{
                return res.send({
                    success: true,
                    data: data
                })
            }
        })
}