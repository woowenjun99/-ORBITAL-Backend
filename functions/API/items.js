require("dotenv").config();
const functions = require("firebase-functions");
const { connect } = require("mongoose");
const { getHandler } = require("../handler/items");

const cors = require("cors")({ origin: true });

exports.items = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        await connect(process.env.DB_URL);
        switch (req.method) {
          case "GET":
            await getHandler(res);
            break;

          default:
            return res.status(405).json({ message: "No such method" });
        }
      } catch (e) {
        return res.status(500).json({ message: e });
      }
    });
  });
