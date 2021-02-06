const Token = require("../../models/token")
const user = require('./user');

module.exports.GetUserData = async (req,res) =>{
    const token = req.headers['auth'];
    const decode = await Token.verifyToken(token);

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