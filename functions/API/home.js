require("dotenv").config();
const functions = require("firebase-functions");
const { connection, connect, model } = require("mongoose");
const cors = require("cors")({ origin: true });
const { itemSchema } = require("../service/Schema");

const Item = new model("items", itemSchema);

const getHomeRequest = async ({ headers }) => {
  try {
    let results;
    if (!headers || !headers.uid) {
      results = await Item.aggregate([]).limit(100);
    } else {
      const { uid } = headers;
      const pipeline1 = { $match: { createdBy: { $ne: uid } } };
      results = await Item.aggregate([pipeline1]).limit(100);
    }
    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const homeFunction = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (!connection.readyState) {
        connect(process.env.DB_URL);
      }

      if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed." });
      }

      const { status, message } = await getHomeRequest(req);
      res.status(status).json({ message });
    });
  });

exports.Item = Item;
exports.home = homeFunction;
exports.getHomeRequest = getHomeRequest;
