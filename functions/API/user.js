const { connect } = require("mongoose");
const { postHandler, getHandler, putHandler } = require("../handler/user");
const functions = require("firebase-functions");

exports.user = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        await connect(process.env.DB_URL);
        switch (req.method) {
          case "POST":
            await postHandler(req, res);
            break;

          case "GET":
            await getHandler(req, res);
            break;

          case "PUT":
            await putHandler(req, res);
            break;

          default:
            return res.status(403).json({ error: "No such route" });
        }
      } catch (e) {
        return res.status(500).json({ message: e });
      }
    });
  });
