const { compose } = require('../functional-utils')
const {
  isNotEmpty,
  isRequired,
  isString,
  matchRegex,
  minLength,
  mustBeTrimmed,
  mapAndDeleteKey,
  objectShouldBeEmpty,
  onlyContainsNumbers
} = require('./common')

const validateEmail = compose(
  matchRegex(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ig,
    'Email is in an invalid format'
  ),
  isString('Email must be a string'),
  isNotEmpty('Email cannot be empty'),
  isRequired('Email is required')
)

const validatePassword = compose(
  minLength(8, 'Password must have at least 8 characters'),
  mustBeTrimmed('Password cannot start or end with and empty space'),
  isString('Password must be a string'),
  isNotEmpty('Password cannot be empty'),
  isRequired('Password is required')
)

const validateNusp = compose(
  onlyContainsNumbers('Nusp must only contain numbers'),
  isString('Nusp must be a string'),
  isNotEmpty('Nusp cannot be empty'),
  isRequired('Nusp is required')
)

module.exports.signup = compose(
  objectShouldBeEmpty(),
  mapAndDeleteKey('password', validatePassword),
  mapAndDeleteKey('email', validateEmail)
)

module.exports.login = compose(
  objectShouldBeEmpty(),
  mapAndDeleteKey('password', validatePassword),
  mapAndDeleteKey('email', validateEmail)
)

module.exports.mockAuthUsp = compose(
  objectShouldBeEmpty(),
  mapAndDeleteKey('password', validatePassword),
  mapAndDeleteKey('nusp', validateNusp)
)
