"use strict";

const ConsumerQueueService = require("./services/consumerQueue.service");
const queueName = "test-topic";
ConsumerQueueService.receiveMessageFromQueue(queueName)
  .then(() => {
    console.log(`Messsage consumer started ${queueName}`);
  })
  .catch((error) => {
    console.error(`Message Error: ${error.message}`);
  });
