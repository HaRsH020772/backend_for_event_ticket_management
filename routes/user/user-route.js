const express = require('express');
const router = express.Router();
const { signUpMethod, loginMethod, uploadUserProfileImageMethod } = require('../../controllers/users/user-controller');
const {isLoggedIn} = require("../../middlewares/user-middleware");
const upload = require('../../middlewares/file-handler-middleware');

router.route('/signup').post(signUpMethod);
router.route('/login').post(loginMethod);
router.route('/profile-image-upload').post(isLoggedIn, upload.single('file'), uploadUserProfileImageMethod);

module.exports = router;