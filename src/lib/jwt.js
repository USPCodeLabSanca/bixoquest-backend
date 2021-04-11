const JWT = require('jsonwebtoken');

/**
 * The token may or may not be prefixed with a 'bearer' string. this function verifies
 * that and strips the sole token.
 *
 * @example
 *  'bearer tokenstringconstant' -> 'tokenstringconstant'
 *
 * @argument { string } token
 *
 * @return { string }
 */
function removeBearerFromToken(token) {
  return token.indexOf(' ') !== -1 ? token.split(' ')[1] : token;
}

/**
 * Create a new token that contains a payload.
 *
 * @argument { object } payload
 *
 * @return { string }
 */
function create(payload) {
  return JWT.sign(payload, process.env.JWT_SECRET, {expiresIn: '7 days'});
}

/**
 * Verifies a token and, if successful, returns its payload.
 *
 * @argument { string } token
 *
 * @return { object }
 */
function verify(token) {
  try {
    return JWT.verify(removeBearerFromToken(token), process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

/**
 * Returns the payload of a token, even if it's invalid.
 *
 * @argument {string} token
 *
 * @return {object}
 */
function decode(token) {
  return JWT.decode(removeBearerFromToken(token));
}

module.exports = {
  create,
  verify,
  decode,
};
