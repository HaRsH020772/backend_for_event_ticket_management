const express = require('express');
const router = express.Router();
const { createEventMethod, getAllUpcomingEventsMethod } = require('../../controllers/events/event-controller');
const {isLoggedIn, roleRestrictions} = require('../../middlewares/user-middleware');

router.route('/create').post(isLoggedIn, roleRestrictions("ADMIN"), createEventMethod);

//* This is a cached route
router.route('/list-events').get(isLoggedIn, getAllUpcomingEventsMethod);

module.exports = router;