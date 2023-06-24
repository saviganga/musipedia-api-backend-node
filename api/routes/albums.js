const express = require('express');
const mongoose = require('mongoose');
const albumController = require("../controllers/album")

const router = express.Router();
const AlbumModel = require('../models/album');
const AtristModel = require('../models/artist');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});

const upload = multer({storage: storage});


router.get('/', albumController.get_albums);
router.post('/', checkAuth, upload.single("albumArt"), albumController.create_album);

router.get('/:albumId', albumController.get_album);

router.delete('/:albumId', checkAuth, albumController.delete_album);



module.exports = router;