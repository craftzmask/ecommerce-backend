"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert");
const { connectToRabbitMQTest } = require("../dbs/init.rabbitmq");

describe("RabbitMQ connection", () => {
  it("should connect to successfuly RabbitMQ", async () => {
    const result = await connectToRabbitMQTest();
    assert.strictEqual(result, undefined);
  });
});
