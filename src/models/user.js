const Mongoose = require('mongoose')
const ObjectID = Mongoose.Schema.Types.ObjectId

const userSchema = Mongoose.Schema({
  email: String,
  password: String,
  createdAt: Date,
  id: ObjectID
})

module.exports = Mongoose.model('user', userSchema)
