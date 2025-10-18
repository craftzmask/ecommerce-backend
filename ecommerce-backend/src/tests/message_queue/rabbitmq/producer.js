"use strict";

const amqp = require("amqplib");
const { RABBITMQ_URI } = process.env;
const message = "Hello World";

const runProducer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();
    const queueName = "notificationQueue";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("message sent: ", message);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
