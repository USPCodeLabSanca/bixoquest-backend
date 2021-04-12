const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const MessageSchema = Mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {collection: 'message'},
);

module.exports = Mongoose.model('message', MessageSchema);
