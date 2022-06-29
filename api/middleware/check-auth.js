const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const jwt_token = req.headers.authorization.split(" ")[1];
        const decoded_jwt = jwt.verify(jwt_token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        res.status(400).json({
            message: "Auth failed. No token provided"
        })
    }
   
}
