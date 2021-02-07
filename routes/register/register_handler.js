const register = require('./register');

module.exports.validData = (req,res,next) =>{
    const {user, pass} = req.body;

    /*if(!name){
        return res.send({
            success: false,
            msg: "El Nombre esta vacio"
        })
    } */
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

module.exports.registerUser = (req,res) =>{
    const {user, pass} = req.body;
console.log("sfsdfsdf");
    register.register(user,pass)
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