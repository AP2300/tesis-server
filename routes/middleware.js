const jwt = require('jsonwebtoken');
const _sign = "28838772yuuuuyuyuuuu";

exports.authHeader = function(req, res, next) {
  const token = req.headers['auth'];
  
  if(!token) {
    console.log('No tienen el header autentificado');
    return res.status(401).send({
      msg: 'No posees un header'
    })
  }
  next();
}

exports.validSing = async function(req, res, next) {
  const token = req.headers['auth'];

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