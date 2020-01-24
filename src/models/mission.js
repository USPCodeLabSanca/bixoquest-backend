const mongoose = require('mongoose')

const missionSchema = mongoose.Schema(
  {
    title: String,
    location_reference: String,
    description: String,
    number_stickers: Number,
    lat: Number,
    lng: Number,
    available_at: Number,
    expirate_at: Number,
    key: String,
    type: String
  },
  { collection: 'missions' }
)

module.exports = mongoose.model('missions', missionSchema)
