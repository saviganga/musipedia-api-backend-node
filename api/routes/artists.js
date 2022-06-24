const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
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

const ArtistModel = require('../models/artist');


// incoming get requests to /artists
router.get('/', (req, res, next) => {
    ArtistModel.find()
    .select("_id firstName lastName stageName image")
    .exec()
    .then(allArtists => {
        console.log(allArtists);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched all artists",
            data: allArtists
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    });
});

// post requests to /artists
router.post('/', upload.single("image"), (req, res, next) => {
    console.log(req.file);
    const artistData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        stageName: req.body.stageName,
        DOB: req.body.DOB,
        image: req.file.path

    };

    // create a new artist
    const artist = new ArtistModel(
        {
            _id: new mongoose.Types.ObjectId(),
            firstName: artistData.firstName,
            lastName: artistData.lastName,
            stageName: artistData.stageName,
            DOB: artistData.DOB,
            image: artistData.image
        }      
    );

    // save the model in the db
    
    artist.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "New Artist Created",
            artist: result
        });
    })
    .catch(error => {
        console.log(error);
        res.status(401).json({
            message: "Unable to create artist",
            error: error.message
        });
    })

    
});

router.get('/:artistId', (req, res, next) => {
    const id = req.params.artistId;
    ArtistModel.findById(id)
    .select("_id firstName lastName stageName image")
    .exec()
    .then(thisArtist => {
        console.log(thisArtist);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched artist",
            data: thisArtist
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    })
});

router.delete('/:artistId', (req, res, next) => {
    const id = req.params.artistId
    if (id === 'wizkid') {
        res.status(400).json({
            message: 'Cannot delete Big Wiz'
        });
    } else {
        res.status(200).json({
            message: 'Deleted the motherfucker',
            artist: id
        });
    }
});

module.exports = router;