const jwt = require('jsonwebtoken');
const _sign = process.env.TOKEN_SECRET;

exports.authHeader = function(req, res, next) {
  const token = req.cookies;
  
  if(!token) {
    console.log('No tienen el header autentificado');
    return res.status(401).send({
      msg: 'No posees un header'
    })
  }
  next();
}

exports.validSign = async function(req, res, next) {
  const token = req.cookies.userToken;

  try {
    await jwt.verify(token, _sign);
    next();
  }
  catch(err) {
    return res.status(401).send({
      msg: "No tienes acceso que triste :("
    })
  }
}
