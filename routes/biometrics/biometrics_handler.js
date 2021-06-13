const   Token             = require('../../models/token'), 
        biometrics        = require('./biometrics'),
        { v4: uuidv4 }    = require('uuid'),
        fs                = require('fs');

/**
 * 
 * @param {object} req con los datos a validar
 * @returns un objeto con un mensaje de estado
 */

module.exports.validData = (req,res,next) =>{
    const {code, pass, id, fingerName} = req.body;

    switch(req.route.path) {
        case "/setCode":
            if(!code) {
                return res.send({
                    success: false,
                    msg: "code no esta en el body"
                })
            }
            break
        case "/verifyCode":
            if(!code) {
                return res.send({
                    success: false,
                    msg: "code no esta en el body"
                })
            } else if(!pass) {
                return res.send({
                    success: false,
                    msg: "pass no esta en el body"
                })
            }
            break
        case "/setFinger":
            if(req.files == undefined) {
                return res.send({
                    success: false,
                    msg: "finger no esta en el body"
                })
            } else {
                const { finger } = req.files;
                if(!finger) {
                    return res.send({
                        success: false,
                        msg: "finger no esta en el body"
                    })
                }
            }
            if(!id) {
                return res.send({
                    success: false,
                    msg: "id no esta en el body"
                })
            }
            if(!fingerName) {
                return res.send({
                    success: false,
                    msg: "fingerName no esta en el body"
                })
            }
            break
        case "/setFace":
            console.log("Sdfsdfsdf")
            if(!req.files) {
                console.log("Sdfsdfsdf")
                return res.send({
                    success: false,
                    msg: "face no esta en el body"
                })
            } else {
                const { face } = req.files;
                if(!face) {
                    return res.send({
                        success: false,
                        msg: "face no esta en el body"
                    })
                }
            }
            if(!id) {
                return res.send({
                    success: false,
                    msg: "id no esta en el body"
                })
            }
            break
        case "/deleteMethod":
            console.log("ASDFASDF")
            if(!id) {
                return res.send({
                    success: false,
                    msg: "id no esta en el body"
                })
            }
            break
    }
    next();
}

/**
 * 
 * @param {object} req con el codigo del usuario para registrarlo
 * @returns un objeto con un mensaje de estado
 */

module.exports.setCode = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const { code } = req.body;

    biometrics.setCode(code, decode.id)
    .then( data => {
        res.send({
            success: true,
            msg: data.msg
        });
    })
    .catch( err => {
        res.send({
            success: false,
            msg: err.msg
        });
    });
}

/**
 * 
 * @param {object} req con el codigo a verificar
 * @returns un objeto con un estado
 */

module.exports.verifyCode = (req, res) => {
    const pass = req.body.pass;
    const { code } = req.body;

    if(pass !== 123456) {
        res.send({
            success: false,
            msg: "Pass invalido"
        })
    }

    biometrics.verifyCode(code)
    .then( data => {
        const payLoad = {
            id: data.id,
        }

        Token.signToken(payLoad)
        .then(token =>{

            res.cookie('userToken', token, {
                expires: null,
                httpOnly: true
            }, { signed: true })
            res.status(200).send({
                success: true
            })
        })
        .catch(err =>{
            console.error("Error al firmar el Token",err)
            res.send({
                success: false,
                msg: "Error en el token"
            })
        })
    })
    .catch( err => {
        console.log(err)
        res.send({
            success: false,
            msg: err.msg
        });
    })
}

/**
 * 
 * @param {object} req con el id del usuario para obtener su codigo
 * @returns un objeto con un mensaje de estado y el codigo del usuario
 */

module.exports.getCode = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);

    biometrics.getCode(decode.id)
    .then( data => {
        res.send({
            success: true,
            data: data.data,
            msg: data.msg
        });
    })
    .catch( err => {
        res.send({
            success: false,
            msg: err.msg
        });
    });
}

/**
 * 
 * @param {object} req con el id del usuario y la huella a registrar
 * @returns un objeto con un mensaje de estado 
 */

module.exports.setFinger = async (req,res) =>{
    const { finger } = req.files;
    const { id, fingerName } = req.body;

    let uniqueName = uuidv4();
    let imgSource = `/fingers/${uniqueName}${finger.name.slice(finger.name.indexOf("."))}`;
    finger.mv(`./resources/uploads/fingers/${uniqueName}${finger.name.slice(finger.name.indexOf("."))}`, (err)=>{
        if(err) {
            console.log(err);
        } else {
            biometrics.setFinger(imgSource, id, fingerName)
            .then( data => {
                res.send({
                    success: true,
                    msg: data.msg
                })
            })
            .catch( err => {
                console.log("aqui fue");
                console.log(err);
                console.log(`${imgSource}`);
                fs.unlink(`./resources/uploads${imgSource}`, (err => {
                    if (err) console.log(err);
                    else {
                        console.log("se borro");
                    }
                }));
                res.send({
                    success: false,
                    msg: "Ocurrio un error"
                })
            })
        }
    });
}

/**
 * 
 * @param {object} req con el id del usuario para obtener su huella
 * @returns un objeto con un mensaje de estado y la huella del usuario
 */

module.exports.getFinger = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    console.log(decode.id);
    biometrics.getFinger(decode.id)
    .then( data => {
        console.log("holis");
        res.send({
            success: true,
            data: data.data,
            msg: data.msg
        });
    })
    .catch( err => {
        res.send({
            success: false,
            msg: data.msg
        });
    });
}

/**
 * 
 * @param {object} req con el id del usuario para eliminar un metodo de autenticacion
 * @returns un objeto con un mensaje de estado
 */

module.exports.deleteMethod = async (req,res) =>{
    const { id } = req.body;

    biometrics.deleteMethod(id)
    .then( data => {
        fs.unlink(`./resources/uploads${data.data}`, (err => {
            if (err) console.log(err);
            else {
                console.log("se borro");
            }
        }));
        res.send({
            success: true,
            msg: data.msg
        });
    })
    .catch( err => {
        res.send({
            success: false,
            msg: err.msg
        });
    });
}

/**
 * 
 * @param {object} req con el id del usuario para registrar un metodo de reconocimiento facial
 * @returns un objeto con un mensaje de estado
 */

module.exports.setFace = async (req,res) =>{
    console.log(req.files)
    const { id } = req.body;
    const { face } = req.files;

    let uniqueName = uuidv4();
    let imgSource = `/faces/${uniqueName}${face.name.slice(face.name.indexOf("."))}`;
    face.mv(`./resources/uploads/faces/${uniqueName}${face.name.slice(face.name.indexOf("."))}`, (err)=>{
        if(err) {
            console.log(err);
        } else {
            biometrics.setFace(imgSource, id)
            .then( data => {
                res.send({
                    success: true,
                    msg: data.msg
                })
            })
            .catch( err => {
                console.log("aqui fue");
                console.log(err);
                console.log(`${imgSource}`);
                fs.unlink(`./resources/uploads${imgSource}`, (err => {
                    if (err) console.log(err);
                    else {
                        console.log("se borro");
                    }
                }));
                res.send({
                    success: false,
                    msg: "Ocurrio un error"
                })
            })
        }
    });
}

/**
 * 
 * @param {object} req con el id del usuario para obtener un metodo de reconocimiento facial
 * @returns un objeto con un mensaje de estado y la foto del usuario para el reconocimiento facial
 */

module.exports.getFace = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    console.log(decode.id);
    biometrics.getFace(decode.id)
    .then( data => {
        console.log("holis");
        res.send({
            success: true,
            data: data.data,
            msg: data.msg
        });
    })
    .catch( err => {
        res.send({
            success: false,
            msg: data.msg
        });
    });
}