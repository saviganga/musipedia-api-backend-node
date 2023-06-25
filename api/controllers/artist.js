const mongoose = require('mongoose');
const ArtistModel = require('../models/artist');


exports.create_artist = (req, res, next) => {
    console.log(req.file);
    const artistData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        stageName: req.body.stageName,
        DOB: req.body.DOB,
        // image: req.file.path

    };

    // create a new artist
    const artist = new ArtistModel(
        {
            _id: new mongoose.Types.ObjectId(),
            firstName: artistData.firstName,
            lastName: artistData.lastName,
            stageName: artistData.stageName,
            DOB: artistData.DOB,
            // image: artistData.image
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

    
};

exports.get_artists = (req, res, next) => {
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
};

exports.get_artist =  (req, res, next) => {
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
};

exports.delete_artist = (req, res, next) => {
    

    const artistId = req.params.artistId;

    ArtistModel.remove({
        _id: artistId
    })
    .exec()
    .then(result => {
        res.status(204).json({
            message: "Deleted artist"
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Unable to delete artist",
            data: error
        });
    })

};