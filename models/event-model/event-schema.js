const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
{
    event: {
        eventName: {
            type: String,
            required:[true, 'Please provide a event name']
        },
        organisation: {
            type: String,
            required: [true, "Provide organisation name"]
        }
    },
    organiser: {
        type: String,
        required:[true, 'Provide a team or committee name']
    },
    price: {
        type: Number,
        required: [true, 'Provide a price for event']
    },
    dateForEvent: {
        type: Date,
        required: true
    },
    timeForEvent: {
        type: String,
        required: true
    },
    venueName: {
        type: String,
        default: "Inside Organisation"
    },
    eventCapacity: {
        type: Number,
        required: true
    },
    //* Need to be filled programatically
    eventAdderId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    //* This field are self-managed not provided by user
    eventSubscribers: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Event',eventSchema);