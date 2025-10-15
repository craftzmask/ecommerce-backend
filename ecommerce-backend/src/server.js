"use strict";

const app = require("./app");
const process = require("process");

const PORT = process.env.PORT || 3055;

app.listen(PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`);
});
