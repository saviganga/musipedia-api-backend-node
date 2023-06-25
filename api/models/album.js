const mongoose = require('mongoose');

// declare your models 
const Album = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
    // songs: {type: Array, required: true},
    year: {type: Date, required: true},
    albumArt: {type: String, required: false},
});

module.exports = mongoose.model('Album', Album);
