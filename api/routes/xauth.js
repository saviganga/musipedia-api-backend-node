const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const xauthControllers = require('../controllers/xauth');



router.post('/login', xauthControllers.login);

module.exports = router;

