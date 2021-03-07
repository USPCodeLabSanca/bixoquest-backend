const {compose} = require('../functional-utils');
const {
  isNotEmpty,
  isRequired,
  mapAndDeleteKey,
  objectShouldBeEmpty,
  isString,
} = require('./common');

const validateQueryCoordinate = compose(
    isString('Coordinate must be a string'),
    isNotEmpty('Coordinate cannot be empty'),
    isRequired('Coordinate is required'),
);

module.exports.mission = compose(
    objectShouldBeEmpty(),
    mapAndDeleteKey('lat', validateQueryCoordinate),
    mapAndDeleteKey('lng', validateQueryCoordinate),
);
