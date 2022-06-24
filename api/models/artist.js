const mongoose = require('mongoose');

// declare your models 
const Artist = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    stageName: {type: String, required: true},
    DOB: {type: Date, required: true},
    image: {type: String, required: true}
});

module.exports = mongoose.model('Artist', Artist);
