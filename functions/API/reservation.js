require("dotenv").config();
const { connection, connect, model } = require("mongoose");
const { itemSchema, userSchema } = require("../service/Schema");
const { region } = require("firebase-functions");
const { POST, RENTED, OFFERED } = require("./types");
const cors = require("cors")({ origin: true });
const User = new model("users", userSchema);
const Item = new model("items", itemSchema);

const postReservationRequest = async ({ headers, body }) => {
  try {
    if (!headers || !headers.uid) {
      return { status: 401, message: "Please provide a uid in the headers." };
    } else if (!body || !body.item_id) {
      return { status: 400, message: "Please provide a body." };
    }

    const { uid } = headers;
    const { item_id } = body;

    // 1. Check if the user is valid.
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      return { status: 404, message: "No user found." };
    }

    // 2. Check whether the item can be transacted.
    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      return { status: 404, message: "No item found." };
    } else if (
      foundItem.status === RENTED ||
      (foundItem.status === OFFERED && foundItem.offeredBy !== uid)
    ) {
      return { status: 400, message: "The item cannot be reserved now." };
    } else if (foundItem.createdBy === uid) {
      return { status: 400, message: "You cannot make offer for this item." };
    } else if (foundItem.status === OFFERED && foundItem.offeredBy === uid) {
      return {
        status: 400,
        message: "You have already made an offer for this item.",
      };
    }

    // 3. Proceed with transaction
    foundItem.status = OFFERED;
    foundItem.offeredBy = uid;
    await foundItem.save();
    return { status: 200, message: foundItem };
  } catch ({ message }) {
    return { status: 500, message };
  }
};

const reservationFunction = region("asia-southeast1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }
    let results;
    switch (req.method) {
      case POST:
        results = await postReservationRequest(req);
        break;
      default:
        results = { status: 405, message: "No method found." };
    }

    const { status, message } = results;
    res.status(status).json({ message });
  });
});

exports.reservation = reservationFunction;
exports.postReservationRequest = postReservationRequest;
exports.User = User;
exports.Item = Item;
