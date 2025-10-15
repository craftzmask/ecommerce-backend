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
    throw error;
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
    throw error;
  }
};

const consumerQueue = async ({ channel, queueName }) => {
  try {
    await channel.assertQueue(queueName, {
      durable: true,
    });

    console.log("Waiting for message...");

    channel.consume(
      queueName,
      (message) => {
        console.log("Received message: ", message.content.toString());
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const RabbitMQ = { connectToRabbitMQ, connectToRabbitMQTest, consumerQueue };

module.exports = RabbitMQ;
