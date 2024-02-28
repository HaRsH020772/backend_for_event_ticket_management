const { StatusCodes } = require('http-status-codes');
const User = require('../models/user-model/user-schema');
const customError = require('../utils/custom-error-utils');
const mainPromise = require('./main-promise-middleware');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = mainPromise(async (req, res, next) => {
    const token = req.header('Authorization').replace("Bearer ", "");

    if(!token)
        return next(new customError('Login first to access this page!!', 401));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne(
        {
            _id: decoded.id
        });
    next();
});

exports.roleRestrictions = (...roles) => {

    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new customError('You are not to perform this action', StatusCodes.UNAUTHORIZED));
        next();
    }
}