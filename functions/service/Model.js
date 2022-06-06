const { model } = require("mongoose");
const {
  userSchema,
  transactionSchema,
  eventSchema,
  communitySchema,
} = require("./Schema");

exports.User = new model("users", userSchema);
exports.Transaction = new model("transactions", transactionSchema);
exports.Event = new model("events", eventSchema);
exports.Community = new model("communities", communitySchema);
