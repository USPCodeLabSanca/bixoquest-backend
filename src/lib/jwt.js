const Response = require('./response')
const JWT = require('jsonwebtoken')

const secret = 'very secret secret. secretly guarded.'

/**
The token may or may not be prefixed with a 'bearer' string. this function verifies
that and strips the sole token.
@example
'bearer tokenstringconstant' -> 'tokenstringconstant'
@argument { string } token
@returns { string }
*/
function removeBearerFromToken (token) {
  return token.indexOf(' ') !== -1 ? token.split(' ')[1] : token
}

/** Createas a new token that contains a payload
@argument { Object } payload
@returns { string }
*/
function create (payload) {
  return JWT.sign(payload, secret, { expiresIn: '7 days' })
}

/** verifies a token and, if successful, returns its payload
@argument { string } token
@returns { Object }
*/
function verify (token) {
  try {
    return JWT.verify(removeBearerFromToken(token), secret)
  } catch (e) {
    return null
  }
}

/** returns the payload of a token, even if it's invalid.
@argument { string } token
@returns { Object }
*/
function decode (token) {
  return JWT.decode(removeBearerFromToken(token))
}

/** This H.O.F. (Higher Order Function) verifies if a valid token was given to the
request. If no token is give, automatically returns a 401 error response */
function withAuthorization (handler) {
  return (req, res, next) => {
    if (req.auth) return handler(req, res, next)
    else return Response.failure('Authorization required', 401).send(res)
  }
}

module.exports = {
  create,
  verify,
  decode,
  withAuthorization
}
