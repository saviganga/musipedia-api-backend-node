const mongoose = require('mongoose');

// declare your models 
const Song = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    year: {type: Date, required: true},
    coverArt: {type: String, required: true}
});

module.exports = mongoose.model('Song', Song);