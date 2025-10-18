"use strict";

const amqp = require("amqplib");
const { RABBITMQ_URI } = process.env;

const runOrderedConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();
    const queueName = "orderd-message-queue";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.prefetch(1);

    await channel.consume(queueName, (msg) => {
      setTimeout(() => {
        console.log(msg.content.toString());
        channel.ack(msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

runOrderedConsumer().catch(console.error);
