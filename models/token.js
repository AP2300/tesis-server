const jwt = require('jsonwebtoken');
const _sign = process.env.TOKEN_SECRET;

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
      const token = jwt.sign(data,_sign, {expiresIn:300});
      console.log(token)
      resolve(token)
    }
    catch(err) {
      return reject(err)
    }
  })
}