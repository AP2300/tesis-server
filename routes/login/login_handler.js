//const token = require("./../../models/token")
const login = require("./login");
const passport = require("passport");
const bcrypt = require("bcryptjs");

module.exports.ValidateData =(req, res, next)=> {

    if(!req.body.email){
        return res.send({
            success:false,
            msg:"el email se encuentra vacio"
        })
    }

    if(!req.body.clave){
        return res.send({
            success:false,
            msg:"la contraseña esta vacia"
        })
    }

    next();
}

module.exports.LogUser = (req,res)=>{
    login.login(req.body.email)
    .then(async (data) => {
        if(data == undefined){
            res.send({
                success:false,
                msg:"este usuario no existe"
            })
        }else{
            bcrypt.compare(req.body.clave, data.clave, (err,result)=>{
                if(err){
                    console.log(err);
                }else if(result){
                    const payLoad = {
                        id: data.id,
                        email: data.email,
                        admin: data.rol
                    }
                    
                    token.signToken(payLoad)
                    .then(token =>{
                        console.log(token);

                        res.send({
                            success: true,
                            token:token,
                        })
                    })
                    .catch(err =>{
                        console.log(err);
                        res.send({
                            success:false,
                            msg: "Error en el login"
                        })
                    })
                }else{
                    console.error("La Clave es Incorrecta")
                    res.send({
                        success: false,
                        msg: "La clave es Incorrecta"
                    })
                }
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.send({
            success:false,
            msg: "Error en login"
        })
    })
}

module.exports.singInUser = (req,res,next)=>{
    const dataB=req.body;
    passport.authenticate("local-singin", {
        successRedirect: "/Inicio Sesion",
        failureRedirect: "/fallo",
        failureFlash:true
    }, ()=>{
        
    })(req,res,next)
}