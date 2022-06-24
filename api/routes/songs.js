const express = require('express');
const mongoose = require('mongoose');
const SongModel = require('../models/songs');
const ArtistModel = require('../models/artist')
const multer = require("multer");

// handle storage with multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});


const upload = multer({storage: storage});

const router = express.Router();

router.get('/', (req, res, next) => {
    SongModel.find()
    .select("_id name artist year coverArt")
    .populate('artist', '_id stageName')
    .exec()
    .then(allSongs => {
        console.log(allSongs);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched all songs",
            data: allSongs
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    })
});

router.post('/', upload.single('coverArt'), (req, res, next) => {
    console.log(req.file);
    const artistId = req.body.artist;
    ArtistModel.findById(artistId)
    .exec()
    .then(artist => {
        if (artist) {
            
            const songData = {
                name: req.body.name,
                artist: req.body.artist,
                year: req.body.year,
                coverArt: req.file.path
            };

            // crete the song object
            const song = new SongModel({
                _id: new mongoose.Types.ObjectId(),
                name: songData.name,
                artist: songData.artist,
                year: songData.year,
                coverArt: songData.coverArt
            });

            return song.save()

        } else {
            res.status(400).json({
                message: "No artist with matching id"
            });
        }

    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Added Song",
            song: result
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Unable to add song. Please try again",
            error: error.message
        })
    })
});


router.get('/:songId', (req, res, next) => {
    const id = req.params.songId;
    SongModel.findById(id)
    .select("_id name artist year coverArt")
    .populate('artist', '_id stageName image')
    .exec()
    .then(thisSong => {
        console.log(thisSong);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched song",
            data: thisSong
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    })
});

router.delete('/:songId', (req, res, next) => {
    const id = req.params.songId;
    res.status(200).json({
        message: 'Deleted song',
        album: id
    });
});



module.exports = router;
