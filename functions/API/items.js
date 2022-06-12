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
        connect(process.env.DB_URL);
        let result;
        switch (req.method) {
          case "GET":
            result = await getHandler(req);
            break;

          default:
            return res.status(405).json({ message: "No such method" });
        }

        return res.status(result.status).json(result.message);
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    });
  });
