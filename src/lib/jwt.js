const JWT = require('jsonwebtoken')

const secret = 'very secret secret. secretly guarded.'

module.exports.create = (payload) => {
  return JWT.sign(payload, secret, { expiresIn: '7 days' })
}

module.exports.decode = (token) => {
  return JWT.decode(token)
}
