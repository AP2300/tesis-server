const jwt = require('jsonwebtoken');
const _sign = "o%pQH48$#zw$5J8kKk^Kk6szs9!Y6L^N&VhyR3oUD%dtbu8a!#4WAe93partp2tMXwQTV9p&sMHpaz";

exports.verifyToken = async function(token) {
  try {
    return jwt.verify(token, _sign)
  }
  catch(err) {
    return 'Token invalido'
  }
}

exports.signToken = function(data) {
  return new Promise( (resolve, reject) => {
    try {
      const token = jwt.sign(data,_sign, {expiresIn:10000});
      console.log(token)
      resolve(token)
    }
    catch(err) {
      return reject(err)
    }
  })
}