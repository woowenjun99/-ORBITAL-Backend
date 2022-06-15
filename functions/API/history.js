require("dotenv").config();
const { connect } = require("mongoose");
const { getHandler } = require("../handler/history");
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

exports.history = functions
  .region("asia-southeast1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        connect(process.env.DB_URL);
        let result;

        switch (req.method) {
          case "GET":
            result = await getHandler(req);
            break;

          default:
            return res.status(405).json({ message: "Invalid route" });
        }

        const { status, message } = result;
        return res.status(status).json({ message: message });
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    });
  });
