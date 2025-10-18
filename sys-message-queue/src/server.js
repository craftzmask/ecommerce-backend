"use strict";

const ConsumerQueueService = require("./services/consumerQueue.service");
const queueName = "test-topic";
// ConsumerQueueService.receiveMessageFromQueue(queueName)
//   .then(() => {
//     console.log(`Messsage consumer started ${queueName}`);
//   })
//   .catch((error) => {
//     console.error(`Message Error: ${error.message}`);
//   });

ConsumerQueueService.receiveMessageFromQueueNormal()
  .then(() => console.log("Received Normally"))
  .catch(console.error);

ConsumerQueueService.receiveMessageFromQueueFailure()
  .then(() => console.log("Received Failure"))
  .catch(console.error);
