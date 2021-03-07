const {curry} = require('../functional-utils');

const error = (message) => {
  throw new Error(message);
};

module.exports.isRequired = curry((errorMessage, thing) => {
  if (thing === undefined) error(errorMessage);
  return thing;
});

module.exports.isNotEmpty = curry((errorMessage, thing) => {
  if (!thing) error(errorMessage);
  return thing;
});

module.exports.isString = curry((errorMessage, thing) => {
  if (typeof thing !== 'string') error(errorMessage);
  return thing;
});

module.exports.isNumber = curry((errorMessage, thing) => {
  if (typeof thing !== 'number') error(errorMessage);
  return thing;
});

module.exports.onlyContainsNumbers = curry((errorMessage, thing) => {
  if (thing.match(/\D/)) error(errorMessage);
  return thing;
});

module.exports.mustBeTrimmed = curry((errorMessage, thing) => {
  if (thing.trim() !== thing) error(errorMessage);
  return thing;
});

module.exports.minLength = curry((minLength, errorMessage, thing) => {
  if (thing.length < minLength) error(errorMessage);
  return thing;
});

module.exports.matchRegex = curry((regex, errorMessage, thing) => {
  if (!thing.match(regex)) error(errorMessage);
  return thing;
});

module.exports.mapAndDeleteKey = curry((key, func, object) => {
  func(object[key]);
  const newObject = {...object};
  delete newObject[key];
  return newObject;
});

module.exports.objectShouldBeEmpty = curry((object) => {
  const keys = Object.keys(object);
  if (keys.length > 0) error(`'${keys.join('\', \'')}' should not be received`);
  return object;
});
