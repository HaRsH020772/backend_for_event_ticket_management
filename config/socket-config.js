const {produceMessage} = require("../utils/kafka-utils");
const {getRedisInstance} = require("./redis-config");

//* Configuration of pub-sub
const pub = getRedisInstance();
const sub = getRedisInstance();

exports.activateSocketArea = async (io) => {

    sub.subscribe("MESSAGES");

    io.on('connection', (socket) => {
        console.log(`New user added ${socket.id}`);

        socket.on("event:message", async ({ message }) => {
            console.log(`New message received : ${message}`);
            await pub.publish("MESSAGES", JSON.stringify({ message }));
        })
    });

    sub.on("message", async (channel, message) => {

        if (channel === "MESSAGES") {
            console.log("new message from redis", message);
            io.emit("message", message);
            await produceMessage(message);
            console.log("Message produced to kafka broker");
        }
    });
}