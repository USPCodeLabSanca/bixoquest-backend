const Mongoose = require('mongoose')
const ObjectID = Mongoose.Schema.Types.ObjectId

const userSchema = Mongoose.Schema(
  {
    nusp: String,
    password: String,
    name: String,
    course: String,
    _id: ObjectID
  },
  { collection: 'users-usp' }
)

module.exports = Mongoose.model('users-usp', userSchema)
