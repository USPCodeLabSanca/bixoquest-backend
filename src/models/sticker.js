const Mongoose = require('mongoose')
const ObjectID = Mongoose.Schema.Types.ObjectId

const stickersSchema = Mongoose.Schema({
  image_url: String,
  index: Number,
  _id: ObjectID
}, { collection: 'stickers' })

module.exports = Mongoose.model('stickers', stickersSchema)
