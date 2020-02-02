const authValidators = require('./auth');
const missionValidators = require('./mission');
const { curry } = require('../functional-utils');
const Response = require('../response');

const validateRequest = curry((validator, handler, req, res) => {
  try {
    if (!req.body) throw new Error('Request body cannot be empty');
    if (typeof req.body !== 'object') throw new Error('Request body must be an object');
    validator(req.body);
  } catch (e) {
    Response.failure(e.message, 400).send(res);
    return;
  }

  handler(req, res);
});

const validateRequestQuery = curry((validator, handler, req, res) => {
  try {
    if (!req.query) throw new Error('Request query cannot be empty');
    if (typeof req.query !== 'object') throw new Error('Request query must be an object');
    validator(req.query);
  } catch (e) {
    Response.failure(e.message, 400).send(res);
    return;
  }

  handler(req, res);
});

module.exports = {
  authValidators,
  missionValidators,
  validateRequest,
  validateRequestQuery,
};
