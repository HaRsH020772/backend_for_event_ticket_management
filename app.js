require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require("cors");
const ErrorHandler = require("./middlewares/error-handler-middleware");

//? Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("common"));

//? Bring all the required routes
const user = require('./routes/user/user-route');
const event = require('./routes/event/event-route');

//? router middleware
app.use('/api/user', user);
app.use('/api/event', event);

//? Error handling middleware
app.use(ErrorHandler);

module.exports = app;