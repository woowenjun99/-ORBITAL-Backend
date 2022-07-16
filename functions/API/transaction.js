require("dotenv").config();
const { region } = require("firebase-functions");
const { connect, connection, model, Types } = require("mongoose");
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
  SELL,
  SOLD,
  RENTED,
} = require("./types");

// <----------- MongoDB Models --------------->
const Item = new model("items", itemSchema);
const Transaction = new model("transactions", transactionSchema);
const User = new model("users", userSchema);

// <------------ MongoDB POST REQUEST -------------->
const postTransactionRequest = async ({ headers, body }) => {
  // 1. Validate the inputs
  if (!headers || !headers.uid) {
    return { status: 401, message: NO_UID_IN_HEADER };
  } else if (!body || !body.item_id) {
    return { status: 400, message: INVALID_BODY };
  }
  const { item_id } = body;
  const { uid } = headers;

  // 2. Fire up the transaction
  const session = await connection.startSession();
  session.startTransaction();

  try {
    // 3. Check if the item and the uid are valid.
    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      session.abortTransaction();
      return { status: 404, message: NO_ITEM_FOUND };
    }

    const foundUser = await User.findOne({ uid }, null, { session });
    if (!foundUser) {
      session.abortTransaction();
      return { status: 404, message: "No user found" };
    }

    // 4. Check if the item is available for rent or sale.
    const readyForRent =
      foundItem.typeOfTransaction === RENT &&
      foundItem.status === OFFERED &&
      foundItem.offeredBy === uid;

    const readyForSale =
      foundItem.typeOfTransaction === SELL && foundItem.status === AVAILABLE;

    if (!readyForRent && !readyForSale) {
      session.abortTransaction();
      return {
        status: 400,
        message: "This item is not available for transaction.",
      };
    }

    // 5. Process the transaction
    let transaction;
    if (readyForRent) {
      foundItem.status = RENTED;
      foundItem.currentOwner = uid;
      foundItem.nextAvailablePeriod = foundItem.durationOfRent
        ? Date.now() + foundItem.durationOfRent
        : Date.now() + 604800;

      transaction = new Transaction({
        boardGameId: foundItem._id.toString(),
        price: foundItem.price,
        originalOwner: foundItem.createdBy,
        nextOwner: uid,
        dateTimeTransacted: Date.now(),
        nextAvailablePeriod: foundItem.nextAvailablePeriod,
      });

      foundItem.transactionNumber = transaction._id.toString();
    } else {
      foundItem.status = SOLD;
      foundItem.currentOwner = uid;
      transaction = new Transaction({
        boardGameId: foundItem._id.toString(),
        price: foundItem.price,
        originalOwner: foundItem.createdBy,
        nextOwner: uid,
        dateTimeTransacted: Date.now(),
        nextAvailablePeriod: foundItem.nextAvailablePeriod,
      });
    }

    await foundItem.save({ session });
    await transaction.save({ session });
    
    // 6. End the transaction
    session.commitTransaction();
    return { status: 201, message: foundItem };
  } catch (e) {
    session.abortTransaction();
    return { status: 500, message: e.message };
  }
};

exports.transaction = region("asia-southeast1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== POST) {
      res.status(405).json({ message: "Method not allowed." });
    }

    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }
    const { message, status } = await postTransactionRequest(req);
    res.status(status).json({ message });
  });
});

exports.postTransactionRequest = postTransactionRequest;
exports.Item = Item;
exports.User = User;
exports.Transaction = Transaction;
