require("dotenv").config();
const functions = require("firebase-functions");
const { connection, connect } = require("mongoose");
const app = require("express")();
const cors = require("cors")({ origin: true });
const { getHomeRequest } = require("./handlers/get");

app.use(cors);

app.get("/", async (req, res) => {
  // 1. Connect with the database
  if (!connection.readyState) {
    connect(process.env.DB_URL);
  }

  // 2. Process the request
  const { status, message } = await getHomeRequest(req);

  // 3. Return the response status
  res.status(status).json({ message });
});

exports.home = functions.region("asia-southeast1").https.onRequest(app);

