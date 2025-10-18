"use strict";

const amqp = require("amqplib");
const { RABBITMQ_URI } = process.env;
const message = "Hell World";

const notificationQueue = {
  QUEUE: "notificationQueue",
  FAILURE_QUEUE: "notificationQueueFailure",
  EXCHANGE: "notificationExchange",
  DLX: "notificationDLX",
  DL_ROUTING_KEY: "notificationDLRoutingKey",
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();

    const { QUEUE, EXCHANGE, DLX, DL_ROUTING_KEY } = notificationQueue;

    // 1. create a queue
    await channel.assertQueue(QUEUE, {
      deadLetterExchange: DLX,
      deadLetterRoutingKey: DL_ROUTING_KEY,
      exclusive: false,
    });

    // 2. Create an exchange
    await channel.assertExchange(EXCHANGE, "direct", {
      durable: true,
    });

    // 3. Bind the queue to the exchange
    await channel.bindQueue(QUEUE, EXCHANGE);

    // 4. Publish the message to the exchange
    channel.publish(EXCHANGE, "", Buffer.from(message), {
      expiration: "10000", // Time to live 10s
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

runProducer()
  .then(() => console.log("Started producer DLX"))
  .catch(console.error);
