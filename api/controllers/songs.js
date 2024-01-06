const SongModel = require('../models/songs');
const ArtistModel = require('../models/artist')
const AlbumModel = require('../models/album')
const mongoose = require('mongoose');


exports.create_song = async(req, res, next) => {

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
        let coverArtt = req.file
        if (!coverArtt) {
            coverArt = null
        } else {
            coverArt = coverArtt.path
        }

        // prepare the db payload
        const songData = {
            name: req.body.name,
            artist: artistId,
            year: req.body.year,
            coverArt: coverArt
        }

        // create the object in the db
        const song = new SongModel(
            {
                _id: new mongoose.Types.ObjectId(),
                name: songData.name,
                artist: songData.artist,
                year: songData.year,
                coverArt: songData.coverArt
            }
        );

        newSong = await song.save()

        return res.status(201).json({
            status: "SUCCESS",
            message: "Successfully created song",
            data: newSong
        });

    } catch (err) {
        res.status(500).json({
            status: "FAILED",
            message: "Server Error"
        })
    }

};

exports.get_songs = (req, res, next) => {
    SongModel.find()
    .select("_id name artist year coverArt")
    .populate('artist', '_id stageName')
    .exec()
    .then(allSongs => {
        // console.log(allSongs);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched all songs",
            data: allSongs
        });
    })
    .catch(error => {
        // console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    })
};

exports.get_song = (req, res, next) => {
    const id = req.params.songId;
    SongModel.findById(id)
    .select("_id name artist year coverArt")
    .populate('artist', '_id stageName image')
    .exec()
    .then(thisSong => {
        // console.log(thisSong);
        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched song",
            data: thisSong
        });
    })
    .catch(error => {
        // console.log(error);
        res.status(400).json({
            message: "Bad Request"
        });
    })
};

exports.delete_song = (req, res, next) => {
    const songId = req.params.songId;

    SongModel.remove({
        _id: songId
    })
    .exec()
    .then(result => {
        res.status(204).json({
            message: "Deleted song"
        });
    })
    .catch(error => {
        // console.log(error);
        res.status(400).json({
            message: "Unable to delete song",
            data: error
        });
    })
};
