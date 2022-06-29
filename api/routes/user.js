const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth')
const userControllers = require('../controllers/user');


// const UserModel = require('../models/user');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});

const upload = multer({storage: storage});

router.post('/', upload.single('image'), userControllers.create_user);

router.get('/', checkAuth, userControllers.get_users);

router.get('/:userId', checkAuth, userControllers.get_user);

router.delete('/:userId', checkAuth, userControllers.delete_user);







module.exports = router;
