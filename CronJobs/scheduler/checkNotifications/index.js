require("dotenv").config();
const { scheduleJob } = require("node-schedule");
const { get } = require("axios");
const { connect, connection, model } = require("mongoose");
const { itemSchema } = require("../../../functions/service/Schema");
const { createTransport } = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");

/**
 * Sets up a CRON JOB that checks push notification every 10 seconds
 */
exports.checkNotification = scheduleJob("*/10 * * * * *", async () => {
  console.log(`CHECKING NOTIFICATION NOW AT ${Date().toLocaleString()}`);
  if (!connection.readyState) {
    connect(process.env.DB_URL);
  }
  const Item = new model("items", itemSchema);

  // Sends a GET request to the heartbeat.
  const response = await get(
    "https://betteruptime.com/api/v1/heartbeat/4UxuVssG9kN7YQwhFHBjxtAV"
  );
  console.log(response.status);
});

