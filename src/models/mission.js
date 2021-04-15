const Mongoose = require('mongoose');

const ObjectID = Mongoose.Schema.Types.ObjectId;

const missionSchema = Mongoose.Schema(
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
        enum: ['location', 'key', 'location-with-key', 'qrcode'],
      },
      isSpecial: {
        type: Boolean,
        default: false,
      },
    },
    {collection: 'missions'},
);

module.exports = Mongoose.model('missions', missionSchema);
