const { readdirSync } = require("fs");
const passport = require("passport");
// const token = require("./../../models/token")

module.exports.ValidateData =(req, res, next)=> {
    const dataB=req.body;
    if(!dataB.email){
        return res.send({
            success:false,
            msg:"el email se encuentra vacio"
        })
    }

    if(!dataB.clave){
        return res.send({
            success:false,
            msg:"la contraseña esta vacia"
        })
    }

    next();
}

module.exports.RegisterUser = (req,res,next)=>{
    const dataB=req.body;
    passport.authenticate("local-registro", {
        successRedirect: "/home",
        failureRedirect: "/algo",
        failureFlash:true,
        session: true
    }, (req, res)=>{
        
    })(req,res,next)
    next();
}
