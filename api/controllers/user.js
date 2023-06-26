const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



exports.create_user = async(req, res, next) => {
    console.log(req.body);
    console.log(req.file);

    try {

        const userr = await UserModel.find({email: req.body.email})

        if (userr.length > 0) {
            return res.status(400).json({
                status: "FAILED",
                message: "Oops! User with this email already exists"
            })
        }

        const user = userr[0]

        bcrypt.hash(req.body.password, 10, (err, hash) => 
            {
                if (err) {
                    return res.status(400).json({
                        status: "FAILED",
                        message: "password hash error"
                    })
                }

                const userData = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                }

                const newUser = new UserModel(
                    {
                        _id: new mongoose.Types.ObjectId(),
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        password: userData.password
                    }
                )

                newUser.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            status: "SUCCESS",
                            message: "Successfully created User Profile",
                            data: {
                                _id: newUser._id,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName,
                                email: newUser.email,
                                // image: user.image
                            }
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(400).json({
                            status: "FAILED",
                            message: "Badd Request",
                            data: error.message
                        });
                    })
            }
        )

    } catch (err) {
        res.status(500).json({
            status: "FAILED",
            message: "server error",
            data: err
        })
    }
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