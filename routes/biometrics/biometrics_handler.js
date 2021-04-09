const Token     = require('../../models/token'); 
const biometrics     = require('./biometrics');
const { v4: uuidv4 }        = require('uuid');
const fs = require('fs');

module.exports.validUser = (req,res,next) =>{
    next();
}

module.exports.setFace = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const face = req.files.face;

    let uniqueName = uuidv4();
    let imgSource = `/resources/uploads/faces/${uniqueName}${face.name.slice(face.name.indexOf("."))}`;
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
                fs.unlink(`.${imgSource}`, (err => {
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

module.exports.setFingerprint = (req,res) =>{

}

module.exports.setCode = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const face = req.files.face;

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
                res.send({
                    success: false,
                    msg: err.msg
                })
            })
        }
    });
}

module.exports.getFace = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);

    biometrics.getFace(decode.id)
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
            msg: data.msg
        });
    });
}

module.exports.getFingerprint = (req,res) =>{

}

module.exports.getCode = (req,res) =>{
    
}