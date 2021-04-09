const Token = require("../../models/token")
const user = require('./user');
var _ = require('lodash');
var moment = require('moment'); // require
moment().format(); 

module.exports.GetUserData = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);

    user.GetData(decode.email)
    .then(data =>{
        if(data === undefined){
            return res.send({
                success:false,
                log:false,
                msg:"Usted No esta Autenticado"
            })
        }
        else{
            return res.send({
                success:true,
                data:data,
                id:decode.id,
                log:true,
                msg:"Usuario Autenticado"
            })
        }
    })
    .catch(err =>{
        console.error(err);
        return res.send({
            succes:false,
            msg: "No esta autenticado, hubo un error"
        })
    })
}

module.exports.GetUserAccess = async (req,res) =>{
    const token = req.cookies;
    const decode = await Token.verifyToken(token.userToken);
    user.getAccess(decode.id)
    .then(data =>{
        if(data === undefined){
            return res.send({
                success:false,
                log:false,
                msg:"Usted No esta Autenticado"
            })
        }
        else{
            let groupedResults = _.groupBy(data, (data) => moment(data.RegDate, 'DD/MM/YYYY').startOf('isoWeek'))
            result = Object.entries(groupedResults)
            return res.send({
                success:true,
                data:result[1],
                id:decode.id,
                log:true,
                msg:"Usuario Autenticado"
            })
        }
    })
    .catch(err =>{
        console.error(err);
        return res.send({
            succes:false,
            msg: "No esta autenticado, hubo un error"
        })
    })
}