const User = require('../../models/user-model/user-schema');
const try_catch_of_promise = require('../../middlewares/main-promise-middleware');
const customError = require('../../utils/custom-error-utils');
const {StatusCodes} = require("http-status-codes");
const {uploadFileToCloudinary, deleteFileFromCloudinary} = require("../../utils/media-utils");

exports.signUpMethod = try_catch_of_promise(async (req,res,next) => {

    if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.role || !req.body.organisation)
        next(new customError('Please provide all details', StatusCodes.BAD_REQUEST, false));

    (await User.create(req.body)).save();
    
    return res.status(StatusCodes.CREATED).json({
        message: "User created successfully",
        status: true
    });
});

exports.loginMethod = try_catch_of_promise(async (req, res, next) => {

    const {email, password} = req.body;

    //Check the presence of the above fields
    if(!email || !password)
        next(new customError('Please provide email and password!!', StatusCodes.BAD_REQUEST, false));
    
    //get user from the DB
    const user = await User.findOne({email}).select("+password");

    if(!user)
        return next(new customError('Go for registration first', StatusCodes.NOT_FOUND, false));
    
    // isValidatePassword method present in model user.
    if(!await user.isValidatePassword(password))
        return next(new customError('Email or password does not match!!', 400));

    let token = await user.getJwtToken();

    return res.status(StatusCodes.OK).json({
        status: true,
        token,
        message: "User verified successfully"
    });
});

exports.uploadUserProfileImageMethod = try_catch_of_promise(async (req, res, next) => {
    
    const user = await User.findOne({
        _id: req.user.id
    });

    if(!user)
        return next(new customError("No user found", StatusCodes.NOT_FOUND, false));

    if(user.profile.id !== "" && user.profile.secure_url !== "")
    {
        const confirmDeletion = await deleteFileFromCloudinary(user.profile.id);
        console.log(confirmDeletion)
        if(confirmDeletion)
            await User.findByIdAndUpdate({
                _id: req.user.id
            }, {
                "profile.id": "",
                "profile.secure_url": ""
            });
    }

    const {public_id, secure_url} = await uploadFileToCloudinary(req, "user", "image");

    if(!public_id || !secure_url)
        return next(new customError("Issues in uploading image try again later", StatusCodes.INTERNAL_SERVER_ERROR, false));

    await User.findByIdAndUpdate({
        _id: req.user.id
    }, {
        "profile.id": public_id,
        "profile.secure_url": secure_url
    });

    res.status(StatusCodes.OK).json({
        message: "Image updated succesfully",
        status: true
    });
});