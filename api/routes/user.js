const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
});

const upload = multer({storage: storage});

router.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    UserModel.find({email: req.body.email})
    .exec()
    .then(result => {
        console.log(result);
        if (result.length >= 1) {
            return res.status(400).json({
                message: "Bad Request",
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(400).json({
                        message: "unable to save password",
                        error: err
                    });
                } else {
                    // collect data from the request body and create the user
                    const userData = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                        image: req.file.path
                    };
        
                    const user = new UserModel({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: userData.password,
                        image: userData.image
                    });
        
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "Successfully created User Profile",
                            data: {
                                _id: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                image: user.image
                            }
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(400).json({
                            message: "Badd Request",
                            data: error.message
                        });
                    })
                }
            })
        
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad Request",
            error: error
        });
    })
})

router.get('/', (req, res, next) => {
    UserModel.find({})
    .select("_id firstName lastName email image dateJoined")
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Successfully fetched users",
            count: result.length,
            data: result
        })

    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Error fetching all users",
            error: error
        });
    })

})

router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    UserModel.findById(userId)
    .select()
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Successfully fetched user",
            data: result
        })
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Unable to fetch user",
            error: error.message
        });
    })

})

router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    UserModel.remove({
        _id: userId
    })
    .exec()
    .then(result => {
        res.status(204).json({
            message: "Deleted item"
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Unable to delete user",
            data: error
        });
    })
    
})







module.exports = router;
