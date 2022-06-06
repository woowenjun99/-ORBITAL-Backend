require("dotenv").config();
const { user } = require("./routes/user");
const functions = require("firebase-functions");
const { connect } = require("mongoose");
const cors = require("cors")({ origin: true });

exports.user = user;

exports.functions = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        await connect(process.env.DB_URL);
        switch (req.method) {
          case "GET":
            await getHandler(req, res);
            break;

          default:
            return res.status(405).json({ message: "No such route" });
        }
      } catch (e) {
        return res.status(500).json({ message: e });
      }
    });
  });
