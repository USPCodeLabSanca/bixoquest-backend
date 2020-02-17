const JWT = require('jsonwebtoken');
const Response = require('./response');

const secret = 'very secret secret. secretly guarded.';

/**
 * The token may or may not be prefixed with a 'bearer' string. this function verifies
 * that and strips the sole token.
 *
 * @example
 *  'bearer tokenstringconstant' -> 'tokenstringconstant'
 *
 * @argument { string } token
 *
 * @returns { string }
 */
function removeBearerFromToken(token) {
  return token.indexOf(' ') !== -1 ? token.split(' ')[1] : token;
}

/**
 * Create a new token that contains a payload.
 *
 * @argument { object } payload
 *
 * @returns { string }
 */
function create(payload) {
  return JWT.sign(payload, secret, { expiresIn: '7 days' });
}

/**
 * Verifies a token and, if successful, returns its payload.
 *
 * @argument { string } token
 *
 * @returns { object }
 */
function verify(token) {
  try {
    return JWT.verify(removeBearerFromToken(token), secret);
  } catch (e) {
    return null;
  }
}

/**
 * Returns the payload of a token, even if it's invalid.
 *
 * @argument {string} token
 *
 * @returns {object}
 */
function decode(token) {
  return JWT.decode(removeBearerFromToken(token));
}

/**
 * This H.O.F. (Higher Order Function) verifies if a valid token was given to the
 * request. If no token is give, automatically returns a 401 error response.
 * It yet receives a boolean to  verify if the token is of a normal or an admin user,
 * and if the function can be accessed by a common user.
 *
 * @param {() => void} handler
 * @param {boolean} onlyAdmin
 */
function withAuthorization(handler, onlyAdmin) {
  return (req, res, next) => {
    if (req.auth) {
      const { isAdmin } = req.auth;

      if (isAdmin) {
        return handler(req, res, next);
      }

      if (!onlyAdmin) {
        return handler(req, res, next);
      }

      return Response.failure('Não autorizado como administrador.', 401).send(res);
    }
    return Response.failure('Não autorizado.', 401).send(res);
  };
}

module.exports = {
  create,
  verify,
  decode,
  withAuthorization,
};
