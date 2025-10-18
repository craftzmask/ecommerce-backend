"use strict";

const amqp = require("amqplib");
const { RABBITMQ_URI } = process.env;

const runOrderedProducer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();
    const queueName = "orderd-message-queue";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    for (let i = 0; i < 10; i++) {
      const message = `order-message-[${i}]`;
      channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
    }

    setTimeout(() => {
      connection.close();
    }, 1000);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

runOrderedProducer().catch(console.error);
