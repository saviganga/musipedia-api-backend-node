const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.login = (req, res, next) => {

    // find the user trying to log in
    userModel.find({email: req.body.email})
    .exec()
    .then(result => {
        console.log(result);
        if (result < 1) {
            return res.status(400).json({
                messsage: "Invalid Credentials"
            });
        } else {
            user = result[0];
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        message: "Bad Auth",
                        data: err
                    });
                }

                if (result) {
                    console.log(result);
                    userToken = jwt.sign(
                        {
                            email: user.email,
                            lastName: user.lastName,
                            userId: user._id
                        },
                        process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "1hr"
                        }
                    );
                    return res.status(200).json({
                        message: "Login Successful",
                        token: userToken
                    });
                }

                res.status(400).json({
                    message: "Bad Request"
                });

            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Bad"
        });
    })
};
