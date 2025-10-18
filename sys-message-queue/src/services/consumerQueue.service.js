"use strict";

const RabbitMQ = require("../dbs/init.rabbitmq");

const notificationQueue = {
  QUEUE: "notificationQueue",
  FAILURE_QUEUE: "notificationQueueFailure",
  EXCHANGE: "notificationExchange",
  DLX: "notificationDLX",
  DL_ROUTING_KEY: "notificationDLRoutingKey",
};

const receiveMessageFromQueue = async (queueName) => {
  try {
    const { channel } = await RabbitMQ.connectToRabbitMQ();
    await RabbitMQ.consumerQueue({ channel, queueName });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const receiveMessageFromQueueNormal = async () => {
  try {
    const { channel } = await RabbitMQ.connectToRabbitMQ();
    const { QUEUE } = notificationQueue;

    // Simulate TTL and we catch the error
    // The message expiration is 10s but this
    // takes 15s to consume => direct it into DL Queue
    // setTimeout(() => {
    //   channel.consume(QUEUE, (msg) => {
    //     console.log("Received normally msg::", msg.content.toString());
    //     channel.ack(msg);
    //   });
    // }, 15000);

    // Simulate logic error and we catch the error
    // and pass that message down to failure queue
    channel.consume(QUEUE, (msg) => {
      try {
        const numtest = Math.random();
        console.log(numtest);
        if (numtest < 0.8) {
          throw new Error("Send notification failed");
        }

        console.log("Received normally msg::", msg.content.toString());
        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const receiveMessageFromQueueFailure = async () => {
  try {
    const { channel } = await RabbitMQ.connectToRabbitMQ();
    const { FAILURE_QUEUE, DLX, DL_ROUTING_KEY } = notificationQueue;

    await channel.assertQueue(FAILURE_QUEUE, {
      exclusive: false,
    });

    await channel.assertExchange(DLX, "direct", {
      durable: true,
    });

    await channel.bindQueue(FAILURE_QUEUE, DLX, DL_ROUTING_KEY);

    channel.consume(
      FAILURE_QUEUE,
      (msg) => {
        console.log("Received failure msg::", msg.content.toString());
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

const ConsumerService = {
  receiveMessageFromQueue,
  receiveMessageFromQueueNormal,
  receiveMessageFromQueueFailure,
};

module.exports = ConsumerService;
