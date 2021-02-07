const token     = require('../../models/token'); 
const login     = require('./login');
const bcrypt    = require('bcryptjs');

module.exports.validData = (req,res,next) =>{
    const {user, pass} = req.body;

    if(!user){
        return res.send({
            success: false,
            msg: "El usuario esta vacio"
        })
    } 
    if(!pass){
        return res.send({
            success: false,
            msg: "La Clave esta vacio"
        })
    }

    next();
}

module.exports.loginUser = (req,res) =>{
    const {user, pass} = req.body;

    login.login(user)
    .then(async (data) =>{
        if(data == undefined){
            res.send({
                success: false,
                msg: 'El Usuario no existe'
            }) 
        }else{
            bcrypt.compare(String(pass), data.password, (err, result) =>{
                if(err){
                    console.log(err);
                } else if(result){
                    const payLoad = {
                        id: data.id,
                        username: data.username
                    }

                    token.signToken(payLoad)
                    .then(token =>{
                        var d = new Date();
                        d.setTime(d.getTime() + 60 * 1000);
                        res.cookie('userToken', token, {
                            expires: new Date(Date.now() + 10000),
                            httpOnly: true
                        });
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
                } else{
                    console.error("La Clave es Incorrecta")
                    res.send({
                        success: false,
                        msg: "La clave es Incorrecta"
                    })
                }
            })
        }
        
    })
    .catch(err =>{
        console.error("Error al realizar el login",err);
        res.send({
            success: false,
            msg: "Error al realizar el login"
        })
    })
}