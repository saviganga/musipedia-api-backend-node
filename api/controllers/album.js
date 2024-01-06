const AlbumModel = require('../models/album');
const ArtistModel = require('../models/artist');
const mongoose = require('mongoose');



exports.get_albums = (req, res, next) => {

    // get all the album data from the db 
    // check if the db is empty
    AlbumModel
    .find()
    .select("_id name artist songs year albumArt")
    .populate('artist', '_id stageName')
    .exec()
    .then(allAlbums => {
        // console.log(allAlbums);
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
        // console.log(error);
        res.status(400).json({
            message: "Bad Request",
            error: error.message
        });
    })
};

exports.create_album = async(req, res, next) => {

    try {

        // get artist stage name from request body
        const artistStageName = req.body.artist
        const artistt = await ArtistModel.find({stageName: artistStageName})
        const artist = artistt[0]
        if (!artist) {
            return res.status(400).json({
                status: "FAILED",
                message: "Oops! Artist with this stage name does not exist"
            })
        }
        const artistId = artist._id
        let albumArtt = req.file
        if (!albumArtt) {
            albumArt = null
        } else {
            albumArt = albumArtt.path
        }

        // prepare the db payload
        const albumData = {
            name: req.body.name,
            artist: artistId,
            songs: req.body.songs,
            year: req.body.year,
            albumArt: albumArt
        }

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

        newAlbum = await album.save()

        return res.status(201).json({
            status: "SUCCESS",
            message: "Successfully created album",
            data: newAlbum
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "FAILED",
            message: "Server Error"
        })
    }
};

exports.get_album = (req, res, next) => {
    const id = req.params.albumId;
    AlbumModel.findById(id)
    .select("_id name artist songs year albumArt")
    .populate('artist', '_id stageName image')
    .exec()
    .then(thisAlbum => {
        // console.log(thisAlbum);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched album",
            data: thisAlbum
        });
    })
    .catch(error => {
        // console.log(error);
        res.status(400).json({
            message: "Bad Request",
            error: error
        });
    })
};

exports.delete_album = (req, res, next) => {
    const albumId = req.params.albumId;
    AlbumModel.remove({
        _id: albumId
    })
    .exec()
    .then(result => {
        res.status(204).json({
            message: "Deleted album"
        });
    })
    .catch(error => {
        // console.log(error);
        res.status(400).json({
            message: "Unable to delete album",
            data: error
        });
    })
    
};
