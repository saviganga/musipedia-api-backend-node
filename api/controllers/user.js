const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



exports.create_user = (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    UserModel.find({email: req.body.email})
    .exec()
    .then(result => {
        console.log(result);
        if (result.length >= 1) {
            return res.status(400).json({
                message: "Bad request",
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
                        // image: req.files.path
                    };
        
                    const user = new UserModel({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: userData.password,
                        // image: userData.image
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
                                // image: user.image
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
};

exports.get_users = async(req, res, next) => {

    try {

        // get the user from the userId returned from check auth
        const user = await UserModel.findById(req.userId)

        // confirm user exists
        if (!user) {
            return res.status(404).json({ status: "FAILED", message: 'User not found' });
        }

        // check if user is admin
        if (user.isAdmin) {
            const allUsers = await UserModel.find();
            res.json(allUsers);
        } else {
            res.status(200).json({
                status: "SUCCESS",
                message: 'successfully fetched users',
                data: user
            })
            // res.json(user)
        }

    } catch (error) {

        console.error(error)
        res.status(500).json({ status: "FAILED", message: 'Internal server error' });

    }
    
};

exports.get_user = async(req, res, next) => {


    try {
        const user = await UserModel.findById(req.userId)
        const userId = req.params.userId

        if (!user) {
            return res.status(404).json({ status: "FAILED", message: 'User not found' });
        }

        if (user.isAdmin) {
            const userProfile = await UserModel.findById(userId);
            res.json(userProfile);
        } else {
            if (req.userId !== userId) {
                return res.status(404).json({ status: "FAILED", message: 'cannot fetch user profile' });
            }
            res.status(200).json({
                status: "SUCCESS",
                message: 'successfully fetched user',
                data: user
            })
            // res.json(user)
        }


    } catch (error) {

        console.error(error)
        res.status(500).json({ status: "FAILED", message: 'Internal server error' });

    }

};

exports.delete_user = (req, res, next) => {
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
    
};