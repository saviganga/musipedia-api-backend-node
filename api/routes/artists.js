const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const artistController = require('../controllers/artist');


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
router.get('/', artistController.get_artists);

// post requests to /artists
router.post('/', checkAuth, upload.single("image"), artistController.create_artist);

router.get('/:artistId', checkAuth, artistController.get_artist);

router.delete('/:artistId', artistController.delete_artist);

module.exports = router;