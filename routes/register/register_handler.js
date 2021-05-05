const register = require('./register');

module.exports.validData = (req,res,next) =>{
    const data = req.body;

    if(!data.name){
        return res.send({
            success: false,
            msg: "El Nombre esta vacio"
        })
    } 
    if(!data.email){
        return res.send({
            success: false,
            msg: "El email esta vacio"
        })
    } 
    if(!data.pass){
        return res.send({
            success: false,
            msg: "La Clave esta vacio"
        })
    }

    next();
}

module.exports.registerUser = (req,res) =>{
    const data = req.body;
    register.register(data)
    .then(data =>{
        console.log(data);
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
            msg: err.msg,
            data: data
        })
    })
}