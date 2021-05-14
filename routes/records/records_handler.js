const   Token             = require('../../models/token'), 
        records           = require('./records'),
        fs                = require('fs');

module.exports.validData = async (req,res,next) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const { id } = decode;

    switch(req.route.path) {
        case "/setRecord":
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

module.exports.setRecord = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    const { id } = decode;

    records.setRecord(id)
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
    