require('dotenv').config();
const app = require('./app');
const connectWithDb = require('./config/db-config');
const cloudinary = require('cloudinary').v2;
const http = require("http").Server(app);
// const socket = require("socket.io");
// const { activateSocketArea } = require("./config/socket-config");
// const {startMessageConsumer} = require('./utils/kafka-utils');

(async function init() {

    //* Connection with the database
    connectWithDb();

    //* Kafka consumer configuration
    // startMessageConsumer();

    //* cloudinary config goes here
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    //* Socket Configuration
    // const io = socket(http, {
    //     cors: {
    //         origin: "*",
    //         allowedHeaders: ["*"]
    //     }
    // });
    // await activateSocketArea(io);

    //* Server Configuration
    http.listen(process.env.PORT, () => {
        console.log(`PORT is running at ${process.env.PORT}`);
    });
})();