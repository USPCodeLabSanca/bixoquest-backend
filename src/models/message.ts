import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const MessageSchema = new Mongoose.Schema(
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

export default Mongoose.model('message', MessageSchema);
