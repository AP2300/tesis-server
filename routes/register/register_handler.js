const register = require('./register');

module.exports.validData = (req,res,next) =>{
    const {name,email,pass} = req.body;

    if(!name){
        return res.send({
            success: false,
            msg: "El Nombre esta vacio"
        })
    } 
    if(!email){
        return res.send({
            success: false,
            msg: "El email esta vacio"
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

module.exports.registerUser = (req,res) =>{
    const {name,email,pass} = req.body;
console.log("sfsdfsdf");
    register.register(name,email,pass)
    .then(data =>{
        if(data.query){
            console.log('Un Usuario fue Registrado con estos datos ')
            res.send({
                success: true,
                data: data,
                msg: 'El Usuario fue Registrado Satisfactoriamente'
            })
        } 
    })
    .catch(err =>{
        console.error("Aqui",err);
        res.send({
            success: false,
            msg: err.msg
        })
    })
}