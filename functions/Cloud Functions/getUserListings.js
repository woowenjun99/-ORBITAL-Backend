require("dotenv").config();
const functions = require("firebase-functions");
const { connect, connection } = require("mongoose");
const { Item } = require("../service/Model");
const cors = require("cors")({ origin: true });

exports.findUserItemsFromDatabase = async (uid, status) => {
  try {
    // 1. Connect to the database.
    if (!connection.isReady) {
      connect(process.env.DB_URL);
    }

    // 2A. Create a pipeline for the items that are createdByTheUser
    let pipeline, results;

    if (status === "available" || status === "offered" || status === "sold") {
      // GET user listings based on the status
      results = await Item.find({
        $and: [{ createdBy: uid }, { status }],
      });
    } else if (status === "purchased") {
      results = await Item.find({
        $and: [{ currentOwner: uid }, { status: "sold" }],
      });
    } else if (status === "reservation") {
      results = await Item.find({ offeredBy: uid });
    } else {
      results = await Item.find({ createdBy: uid });
    }

    // Sort them in descending order of timeCreated
    results.forEach((element) => {
      element._id = element._id.toString();
    });

    return results;
  } catch (e) {
    console.error(e.message);
    throw new Error(e.message);
  }
};

exports.getUserListings = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
      }

      const { status, message } = await this.processRequest(req);
      res.status(status).json({ message: message });
    });
  });

exports.processRequest = async (req) => {
  const { uid, status } = req.query;
  if (!uid) {
    return { status: 403, message: "User is not logged in." };
  }

  try {
    const foundItems = await this.findUserItemsFromDatabase(uid, status);
    return { status: 200, message: foundItems };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
