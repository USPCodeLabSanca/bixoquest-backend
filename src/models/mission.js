const mongoose = require('mongoose')


const missionSchema = mongoose.Schema({
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