"use strict";

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/test";

const TestModel = mongoose.model("Test", new mongoose.Schema({ name: String }));

describe("Test mongoDB connection", () => {
  before(async () => {
    await mongoose.connect(connectString);
  });

  it("should connect to mongoDB", async () => {
    assert.strictEqual(mongoose.connection.readyState, 1);
  });

  it("should save a document to the database", async () => {
    const user = await TestModel({ name: "test" });
    await user.save();
    assert(!user.isNew);
  });

  it("should find a document in the database", async () => {
    const user = await TestModel.findOne({ name: "test" });
    assert(user);
    assert.strictEqual(user.name, "test");
  });

  after(async () => {
    await mongoose.disconnect();
  });
});
