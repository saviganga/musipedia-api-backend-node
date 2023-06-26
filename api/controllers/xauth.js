const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.login = async(req, res, next) => {

    try {

        const userr = await userModel.find({email: req.body.email})
        const user = userr[0]

        if (!user) {
            return res.status(401).json({
                "status": "FAILED",
                "message": "Invalid credentials"
            })
        }

        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) {
                console.log(err)
                return res.status(401).json({
                    status: "FAILED",
                    message: "Unauthenticated user",
                    data: err
                })
            }

            if (result) {
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
                )
    
                return res.status(200).json({
                    status: "SUCCESS",
                    message: "Login successful",
                    token: userToken,
                    userId: user._id
    
                })
            }

            res.status(401).json(
                {status: "FAILED", message: "bad auth"}
            )
        }
        )


    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: "Server error",
            data: error
        })
    }

    
};
