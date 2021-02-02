const _token = require("./../../models/token")
const user = require("./user");

module.exports.GetUserData = async (req, res)=>{

    const token = req.headers["auth"];
    const decode = await _token.verifyToken(token);

    user.user(decode.id)
    .then(data =>{
        if(data==null){
            return res.send({
                success:true,
                data:data,
                id:decode.id,
                log:false,
                admin: decode.admin
            })
        }else{
            return res.send({
                success:true,
                data:data,
                id:decode.id,
                log:true,
                admin: decode.admin
            })
        }
    })
    .catch(err =>{
        console.log(err);
        return res.send({
            success:false
        })
    })
}

module.exports.GetUsersData = async (req, res)=>{
    user.users()
    .then(data =>{
        if(data==null){
            return res.send({
                success:true,
                data:data,
                msg: "No hay usuarios para mostrar"
            })
        }else{
            return res.send({
                success:true,
                data:data,
                msg: "Lista de usuarios"
            })
        }
    })
    .catch(err =>{
        console.log(err);
        return res.send({
            success:false,
            msg: err
        })
    })
}

module.exports.DeleteUser = async (req, res)=>{
    let id = req.params.id;

    user.DelUser(id)
    .then(data =>{
        return res.send({
            success:true,
            msg: "Usuario eliminado satisfactoriamente"
        });
    })
    .catch(err =>{
        console.log(err);
        return res.send({
            success:false,
            msg: err
        });
    })
}

module.exports.GetUserInfo = async (req, res)=>{
    let id = req.params.id;

    user.userInfo(id)
    .then(data =>{
        return res.send({
            success:true,
            data:data,
        });
    })
    .catch(err =>{
        console.log(err);
        return res.send({
            success:false,
            msg: err
        })
    })
}

module.exports.EditUser = async (req, res)=>{
    let id = req.params.id;
    let data = req.body;

    user.editUser(data, id)
    .then(data =>{
        return res.send({
            success:true,
            msg: data,
        });
    })
    .catch(err =>{
        console.log(err);
        return res.send({
            success:false,
            msg: err
        })
    })
}