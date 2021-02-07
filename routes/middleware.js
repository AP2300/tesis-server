const jwt = require('jsonwebtoken');
const _sign = "o%pQH48$#zw$5J8kKk^Kk6szs9!Y6L^N&VhyR3oUD%dtbu8a!#4WAe93partp2tMXwQTV9p&sMHpaz";

exports.authHeader = function(req, res, next) {
  const token = req.cookies;
  console.log(token);
  
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

function GenerateKey(times) {
  let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&/()=?¡]~';
  let result = '';
  for ( var i = 0; i < times; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.times));
  }
  return result;
}