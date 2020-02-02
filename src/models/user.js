const Mongoose = require('mongoose');

const ObjectID = Mongoose.Schema.Types.ObjectId;

const userSchema = Mongoose.Schema(
  {
    _id: ObjectID,
    nusp: String,
    name: String,
    isAdmin: Boolean,
    course: String,
    completed_missions: Array,
    available_packs: Number,
    opened_packs: Number,
    stickers: Array,
  },
  { collection: 'users' },
);

module.exports = Mongoose.model('users', userSchema);
