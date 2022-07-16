require("dotenv").config();
const { region } = require("firebase-functions");
const { connect, connection, model, startSession } = require("mongoose");
const cors = require("cors")({ origin: true });
const {
  userSchema,
  transactionSchema,
  itemSchema,
} = require("../service/Schema");
const {
  INVALID_BODY,
  NO_UID_IN_HEADER,
  POST,
  NO_ITEM_FOUND,
  OFFERED,
  AVAILABLE,
  RENT,
  SELL
} = require("./types");
const Item = new model("items", itemSchema);

const postTransactionRequest = async ({ headers, body }) => {
  try {
    if (!headers || !headers.uid) {
      return { status: 401, message: NO_UID_IN_HEADER };
    } else if (!body || !body.item_id) {
      return { status: 400, message: INVALID_BODY };
    }
    const { item_id } = body;

    // 1. GET THE ITEM FROM THE DATABASE.
    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      return { status: 404, message: NO_ITEM_FOUND };
    }

    // Defining the 2 conditions for transactions.
    const readyForRent =
      foundItem.typeOfTransaction === RENT &&
      foundItem.status === OFFERED &&
      foundItem.offeredBy === uid;

    const readyForSale =
      foundItem.typeOfTransaction === SELL && foundItem.status === AVAILABLE;

    if (!readyForRent && !readyForSale) {
      return {
        status: 400,
        message: "This item is not available for transaction.",
      };
    }

    
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

exports.transaction = region("asia-southeast1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== POST) {
      res.status(405).json({ message: "Method not allowed." });
    }

    const { message, status } = await postTransactionRequest(req);
    res.status(status).json({ message });
  });
});

exports.postTransactionRequest = postTransactionRequest;
exports.Item = Item;
