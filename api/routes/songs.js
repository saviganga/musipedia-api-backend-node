const express = require('express');
const mongoose = require('mongoose');
const SongModel = require('../models/songs');
const ArtistModel = require('../models/artist')
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');
const songControllers = require('../controllers/songs');

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

router.get('/', songControllers.get_songs);

router.post('/', checkAuth, upload.single('coverArt'), songControllers.create_song);


router.get('/:songId', checkAuth, songControllers.get_song);

router.delete('/:songId', songControllers.delete_song);


module.exports = router;
