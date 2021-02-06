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
    passport.authenticate("local", (err, user, info)=>{
        if(!user) console.log("user vacio");
        if(info) console.log(info);
        if(err) console.log(err);
        req.logIn(user, (err)=>{
            if(err) return next(err)
            else res.status(200).json({errors:false, user: user})
        })
    })(req,res,next)
    next();
}
