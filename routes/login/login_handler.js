const token = require('../../models/token');
const login = require('./login');
const bcrypt = require('bcryptjs');

module.exports.validData = (req, res, next) => {
    const { email, pass } = req.body;

    if (!email) {
        return res.send({
            success: false,
            msg: "El Correo esta vacio"
        })
    }
    if (!pass) {
        return res.send({
            success: false,
            msg: "La Clave esta vacio"
        })
    }

    next();
}

module.exports.LogOut = async (req, res) => {
    const tokenCookie = req.cookies;
    const decode = await token.verifyToken(tokenCookie.userToken);

    login.logOut(decode.id)
    .then(async (data) => {
        if(data === undefined){
            res.send({
                success: false,
                msg: 'Hubo un error'
            })
        }
        else if(data) {
            res.clearCookie("userToken", { httpOnly: true }, { signed: true }).json({ success: true })
        }
    })
    .catch(err => {
        console.error("Error al realizar el logOut", err);
        res.clearCookie("userToken", { httpOnly: true }, { signed: true }).json({ success: true })
    })
}

module.exports.loginUser = (req, res) => {
    const { email, pass } = req.body;

    login.login(email)
        .then(async (data) => {
            if (data == undefined) {
                res.send({
                    success: false,
                    msg: 'El Correo no existe'
                })
            } else {
                bcrypt.compare(String(pass), data.Password, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else if (result) {
                        const payLoad = {
                            id: data.IDUser,
                            email: data.Email,
                            FullName: data.FullName
                        }
                        if (data.IsActive) {
                            token.signToken(payLoad)
                                .then(token => {

                                    login.ActiveSession(data.IDUser,token)
                                        .then(async (Session) => {
                                            if (Session === false) {
                                                res.send({
                                                    success: false,
                                                    session: true,
                                                    msg: 'El usuario ya tiene una sesion activa, Espere 5 Minutos'
                                                })
                                            } else if (Session) {
                                                res.cookie('userToken', token, {
                                                    // expires: new Date(Date.now() + 1000000),
                                                    httpOnly: true
                                                }, { signed: true })

                                                res.status(200).send({
                                                    success: true,
                                                    isActive: data.IsActive
                                                })
                                            } else {
                                                res.send({
                                                    success: false,
                                                    msg: "Error al realizar el login, problema con el evento"
                                                })
                                            }
                                        })
                                        .catch(err => {
                                            console.error("Error al cambiar el evento de sesion del usuario", err);
                                            res.send({
                                                success: false,
                                                msg: "Error al realizar el login, evento no cambiado"
                                            })
                                        })
                                })
                                .catch(err => {
                                    console.error("Error al firmar el Token", err)
                                    res.send({
                                        success: false,
                                        msg: "Error en el token"
                                    })
                                })
                        } else {
                            res.status(200).send({
                                success: true,
                                isActive: data.IsActive
                            })
                        }
                    } else {
                        console.error("La Clave es Incorrecta")
                        res.send({
                            success: false,
                            msg: "La clave es Incorrecta"
                        })
                    }
                })
            }

        })
        .catch(err => {
            console.error("Error al realizar el login", err);
            res.send({
                success: false,
                msg: "Error al realizar el login"
            })
        })
}

module.exports.CheckIsUserActive = async (req, res) =>{
    const tokenCookie = req.cookies;
    const decode = await token.verifyToken(tokenCookie.userToken);

    login.CheckIfActive(decode.id, token)
    .then(data=>{
        if(data){
            res.send({
                success: true,
                msg: "sesion activa",
                session: "active"
            })
        }else{
            res.clearCookie("userToken", { httpOnly: true }, { signed: true }).json({ success: true, session: "vencida" })
        }
    })
}