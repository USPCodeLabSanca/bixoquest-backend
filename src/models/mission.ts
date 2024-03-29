import Mongoose from 'mongoose';

const ObjectID = Mongoose.Schema.Types.ObjectId;

const missionSchema = new Mongoose.Schema(
    {
      _id: ObjectID,
      title: String,
      locationReference: String,
      description: String,
      numberOfPacks: Number,
      lat: Number,
      lng: Number,
      availableAt: Number,
      expirateAt: Number,
      key: String,
      type: {
        type: String,
        enum: ['location', 'key', 'location-with-key', 'qrcode', 'group'],
      },
      minimumOfUsersToComplete: Number,
      users: {
        type: [{type: Mongoose.Schema.Types.ObjectId, ref: 'user'}],
        default: [],
      },
      lastJoinAt: Number,
      isSpecial: {
        type: Boolean,
        default: false,
      },
    },
    {collection: 'missions'},
);

export default Mongoose.model('missions', missionSchema);
