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

/** This H.O.F. (Higher Order Function) verifies if a token is valid in the specific
request. If the token is valid, it populates `req.auth` with it's payload, and already
creates a refresh token to ben sent. If it's invalid, automatically returns a 401
error response */
function withAuthorization (handler) {
  return (req, res, next) => {
    const authFail = res => Response.failure('Authorization required', 401).send(res)

    const token = req.headers.authorization // extract token
    if (!token) return authFail()
    const payload = verify(token) // extract payload
    if (!payload) return authFail()
    req.auth = payload // populate `req.auth` with the payload
    res.setHeader('authorization', create({ id: payload.id })) // refresh token

    if (req.auth) return handler(req, res, next)
    else return authFail()
  }
}

module.exports = {
  create,
  verify,
  decode,
  withAuthorization
}
