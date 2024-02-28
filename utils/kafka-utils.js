const {Kafka} = require('kafkajs');
const Chat = require("../models/chat-model/chat-schema");
const {getKafkaInstance} = require('../config/kafka-config');

const kafka = getKafkaInstance();

let producer = null;

const createProducer = async () => {

    if(producer)
        return producer;

    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

exports.produceMessage = async (message) => {
    const producer = await createProducer();
    await producer.send({
        messages: [{
            key: `message-${Date.now()}`,
            value: message
        }],
        topic: "MESSAGES"
    });

    return true;
}

exports.startMessageConsumer = async () => {

    console.log("Consumer is running !!");

    const consumer = kafka.consumer({
        groupId: "default"
    });
    await consumer.connect();
    await consumer.subscribe({
        topic: "MESSAGES",
        fromBeginning: true
    });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({message, pause}) => {
            try {
                console.log(JSON.parse(message.value.toString()));
                await Chat.create({
                    text: JSON.parse(message.value.toString()).message
                })
            } catch (error) {
                console.log("Issues at kafka message consumer");
                pause();
                setTimeout(() => {
                    consumer.resume([{
                        topic: "MESSAGES"
                    }])
                }, 60*1000);
            }
        }
    })
}