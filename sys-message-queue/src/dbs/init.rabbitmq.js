"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("Connection not established");
    }
    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.error(error);
  }
};

const connectToRabbitMQTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.sendToQueue(queueName, Buffer.from("Connected to RabbitMQ"));
    await connection.close();
  } catch (error) {
    console.error(error);
  }
};

const RabbitMQ = { connectToRabbitMQ, connectToRabbitMQTest };

module.exports = RabbitMQ;
