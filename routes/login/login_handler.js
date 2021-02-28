const token     = require('../../models/token'); 
const login     = require('./login');
const bcrypt    = require('bcryptjs');

module.exports.validData = (req,res,next) =>{
    const {email, pass} = req.body;

    if(!email){
        return res.send({
            success: false,
            msg: "El Correo esta vacio"
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
    const {email, pass} = req.body;

    login.login(email)
    .then(async (data) =>{
        if(data == undefined){
            res.send({
                success: false,
                msg: 'El Correo no existe'
            }) 
        }else{
            bcrypt.compare(String(pass), data.Password, (err, result) =>{
                if(err){
                    console.log(err);
                } else if(result){
                    const payLoad = {
                        id: data.IDUser,
                        email: data.Email,
                        FullName: data.FullName
                    }

                    token.signToken(payLoad)
                    .then(token =>{
                        var d = new Date();
                        d.setTime(d.getTime() + 60 * 1000);
                        res.cookie('userToken', token, {
                            expires: new Date(Date.now() + 10000),
                            httpOnly: true
                        })
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