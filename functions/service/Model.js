const { model } = require("mongoose");
const {
  userSchema,
  transactionSchema,
  eventSchema,
  communitySchema,
  itemSchema,
} = require("./Schema");

exports.Item = new model("items", itemSchema);
exports.User = new model("users", userSchema);
exports.Transaction = new model("transactions", transactionSchema);
exports.Event = new model("events", eventSchema);
exports.Community = new model("communities", communitySchema);
