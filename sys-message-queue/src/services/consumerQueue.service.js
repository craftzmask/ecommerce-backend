"use strict";

const RabbitMQ = require("../dbs/init.rabbitmq");

const receiveMessageFromQueue = async (queueName) => {
  try {
    const { channel } = await RabbitMQ.connectToRabbitMQ();
    await RabbitMQ.consumerQueue({ channel, queueName });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ConsumerService = { receiveMessageFromQueue };

module.exports = ConsumerService;
