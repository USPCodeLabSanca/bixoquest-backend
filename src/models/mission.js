const Mongoose = require('mongoose');

const ObjectID = Mongoose.Schema.Types.ObjectId;

const missionSchema = Mongoose.Schema(
    {
      _id: ObjectID,
      title: String,
      location_reference: String,
      description: String,
      number_of_packs: Number,
      lat: Number,
      lng: Number,
      available_at: Number,
      expirate_at: Number,
      key: String,
      type: {
        type: String,
        enum: ['location', 'qrcode', 'key'],
      },
    },
    {collection: 'missions'},
);

module.exports = Mongoose.model('missions', missionSchema);
