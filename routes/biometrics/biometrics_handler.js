const   Token             = require('../../models/token'), 
        biometrics        = require('./biometrics'),
        { v4: uuidv4 }    = require('uuid'),
        fs                = require('fs');

module.exports.validData = (req,res,next) =>{
    const {code, pass, finger, face, id} = req.body;
    switch(req.route.path) {
        case "/setCode":
            if(!code) {
                res.send({
                    success: false,
                    msg: "code no esta en el body"
                })
            }
        case "/verifyCode":
            if(!code) {
                res.send({
                    success: false,
                    msg: "code no esta en el body"
                })
            } else if(!pass) {
                res.send({
                    success: false,
                    msg: "pass no esta en el body"
                })
            }
        case "/setFingerprint":
            if(!finger) {
                res.send({
                    success: false,
                    msg: "finger no esta en el body"
                })
            }
        case "/setFace":
            if(!face) {
                res.send({
                    success: false,
                    msg: "face no esta en el body"
                })
            }
        case "/deleteMethod":
            console.log("ASDFASDF")
            if(!id) {
                res.send({
                    success: false,
                    msg: "id no esta en el body"
                })
            }
    }
    next();
}

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

module.exports.setFinger = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const { finger } = req.files;

    let uniqueName = uuidv4();
    let imgSource = `/fingers/${uniqueName}${finger.name.slice(finger.name.indexOf("."))}`;
    finger.mv(`./resources/uploads/fingers/${uniqueName}${finger.name.slice(finger.name.indexOf("."))}`, (err)=>{
        if(err) {
            console.log(err);
        } else {
            biometrics.setFinger(imgSource, decode.id)
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
                fs.unlink(`./resources${imgSource}`, (err => {
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

module.exports.deleteMethod = async (req,res) =>{
    const { id } = req.body;

    biometrics.deleteMethod(id)
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

module.exports.setFace = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const { face } = req.files;

    let uniqueName = uuidv4();
    let imgSource = `/faces/${uniqueName}${face.name.slice(face.name.indexOf("."))}`;
    face.mv(`./resources/uploads/faces/${uniqueName}${face.name.slice(face.name.indexOf("."))}`, (err)=>{
        if(err) {
            console.log(err);
        } else {
            biometrics.setFace(imgSource, decode.id)
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
                fs.unlink(`./resources/faces${imgSource}`, (err => {
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