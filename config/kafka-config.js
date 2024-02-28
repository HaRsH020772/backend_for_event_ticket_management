const {Kafka} = require('kafkajs');

exports.getKafkaInstance = () => {
    return new Kafka({
        brokers: [process.env.KAFKA_BROKER],
        sasl: {
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
            mechanism: 'plain'
        },
        ssl: {
            ca: [process.env.KAFKA_CA_CERTIFICATE]
        }
    });
}