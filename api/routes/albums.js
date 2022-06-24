const express = require('express');
const mongoose = require('mongoose');
const album = require('../models/album');

const router = express.Router();
const AlbumModel = require('../models/album');
const AtristModel = require('../models/artist');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});

const upload = multer({storage: storage});


router.get('/', (req, res, next) => {

    // get all the album data from the db 
    // check if the db is empty
    AlbumModel
    .find()
    .select("_id name artist songs year albumArt")
    .populate('artist', '_id stageName')
    .exec()
    .then(allAlbums => {
        console.log(allAlbums);
        if (allAlbums.length < 1) {
            return res.status(200).json({
                message: "Fetched all albums",
                data: []
            })

        } else {
            res.status(200).json({
                status: "SUCCESS",
                message: "Fetched all albums",
                data: allAlbums
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request",
            error: error.message
        });
    })
});

router.post('/', upload.single("albumArt"), (req, res, next) => {
    console.log(req.file);
    const artistId = req.body.artist;
    AtristModel.findById(artistId)
    .exec()
    .then(artist => {
        console.log(artist);
        if (artist) {

            const albumData = {
                name: req.body.name,
                artist: req.body.artist,
                songs: req.body.songs,
                year: req.body.year,
                albumArt: req.file.path
            };

            // create the object in the db
            const album = new AlbumModel(
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: albumData.name,
                    artist: albumData.artist,
                    songs: albumData.songs,
                    year: albumData.year,
                    albumArt: albumData.albumArt,
                }
            );

            return album.save()
        } else {
            res.status(400).json({
                message: "No artist with matching id"
            });
        }
    })
    .then(result => {
        console.log(result);
        // return the response
        res.status(201).json({
            message: 'Added album',
            album: result
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Unable to create album. Please try again later",
            error: error.message
        });
    })
});

router.get('/:albumId', (req, res, next) => {
    const id = req.params.albumId;
    AlbumModel.findById(id)
    .select("_id name artist songs year albumArt")
    .populate('artist', '_id stageName image')
    .exec()
    .then(thisAlbum => {
        console.log(thisAlbum);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched album",
            data: thisAlbum
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request",
            error: error
        });
    })
});

router.delete('/:albumId', (req, res, next) => {
    const id = req.params.albumId;
    res.status(200).json({
        message: 'Deleted album',
        album: id
    });
});



module.exports = router;