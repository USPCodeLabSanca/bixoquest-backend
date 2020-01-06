const mongoose = require('mongoose')
const ObjectID = Mongoose.Schema.Types.ObjectId

const missionSchema = mongoose.Schema({
    _id: ObjectID,
    title: String,
    description: String,
    number_stickers: Number,
    lat: Number,
    lng: Number,
    available_at: Date,
    expirate_at: Date,
    key: String,
    type: String
}, { collection: 'missions' })

module.exports = mongoose.model('missions', missionSchema)