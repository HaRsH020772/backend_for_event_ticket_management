const Event = require('../../models/event-model/event-schema');
const User = require('../../models/user-model/user-schema');
const try_catch_of_promise = require('../../middlewares/main-promise-middleware');
const customError = require('../../utils/custom-error-utils');
const {StatusCodes} = require("http-status-codes");
const { default: mongoose } = require('mongoose');
// const {getRedisInstance} = require('../../config/redis-config');

//* redis client for caching purpose
// const client = getRedisInstance();

exports.createEventMethod = try_catch_of_promise(async (req,res,next) => {
    // Fetching the original user
    const user = await User.findOne({
        _id: req.user.id
    });

    if(new Date(req.body.dateForEvent) < Date.now())
        next(new customError('Please provide proper date', StatusCodes.BAD_REQUEST, false));

    if(!req.body.event.eventName || !req.body.organiser || !req.body.timeForEvent || !req.body.dateForEvent || !req.body.price || !req.body.eventCapacity)
        next(new customError('Please provide all details', StatusCodes.BAD_REQUEST, false));

    // Attaching fields
    req.body.event.organisation = user.organisation;
    req.body.eventAdderId = (mongoose.isValidObjectId(req.user.id)) ? req.user.id : mongoose.Types.ObjectId(req.user.id);
    req.body.dateForEvent = new Date(req.body.dateForEvent);

    if(!(await Event.create(req.body)).save())
        next(new customError("Event not created", StatusCodes.BAD_REQUEST, false));
    
    res.status(StatusCodes.CREATED).json({
        message: "Event created successfully",
        status: true
    });
});

exports.getAllUpcomingEventsMethod = try_catch_of_promise(async (req, res, next) => {

    //* Checking the value in cache
    // const cachedValue = await client.get("events");
    // if(cachedValue)
    //     return res.status(StatusCodes.OK).json(
    //     {
    //         message: "cached events retrieved successfully",
    //         events: JSON.parse(cachedValue)
    //     });

    //* Fetching events from db
    let events = await Event.find({
        dateForEvent: {
            $gt: Date.now()
        }
    });

    if(!events || events.length === 0)
        return next(new customError("No events found !!", StatusCodes.NOT_FOUND, false));

    //* Caching the events
    // await client.set("events", JSON.stringify(events));
    // await client.expire("events", 30);

    res.status(StatusCodes.OK).json({
        message: "Events fetched successfully !!",
        events
    });
});