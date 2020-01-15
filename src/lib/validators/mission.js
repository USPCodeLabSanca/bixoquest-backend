const { compose } = require('../functional-utils')
const {
  isNotEmpty,
  isRequired,
  mapAndDeleteKey,
  objectShouldBeEmpty,
  isNumber
} = require('./common')

const validateCoordinate = compose(
  isNumber('Coordinate must be a number'),
  isNotEmpty('Coordinate cannot be empty'),
  isRequired('Coordinate is required')
)

module.exports.mission = compose(
  objectShouldBeEmpty(),
  mapAndDeleteKey('lat', validateCoordinate),
  mapAndDeleteKey('lng', validateCoordinate)
)
