// Requiring the necessary imports
require("dotenv").config();
const functions = require("firebase-functions");
const { connect, connection, model } = require("mongoose");
const cors = require("cors")({ origin: true });
const { userSchema, itemSchema } = require("../service/Schema");

// Creating the mongoose schemas to be used later
const Item = new model("items", itemSchema);
const User = new model("users", userSchema);

/* -------------- START: GET Request --------------------- */
/**
 * Type 1: GET the item by its id.
 * Use Case: When the user wants to preview an item.
 *
 * @param {Object} req The HTTP request body
 * @returns {status: Number, message: String | Object}
 */
const getItemByIdRequest = async (req) => {
  try {
    if (!req.query.id) {
      return { status: 400, message: "No item id provided." };
    }

    const { id } = req.query;
    const foundItem = await Item.findById(id);
    if (!foundItem) {
      return { status: 404, message: "No item found." };
    }
    foundItem._id = foundItem._id.toString();

    return { status: 200, message: foundItem };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const filterAndSearchRequest = async (req) => {
  let searchPipeline, tagPipeline, foundItems, search, tags;

  if (!req.query.search && !req.query.tags) {
    return { status: 400, message: "Please provide a search query or tags." };
  } else if (Array.isArray(req.query.search)) {
    return { status: 400, message: "Please do not provide multiple search queries" };
  }

  if (req.query.search) {
    search = req.query.search;
    searchPipeline = { name: new RegExp(search.trim(), "i") };
  }

  if (req.query.tags) {
    tags = req.query.tags;
    tagPipeline = { tags: { $all: tags } };
  }

  // Start finding the items once the request is valid.
  try {
    if (!tags) {
      foundItems = await Item.find(searchPipeline);
    } else if (!search) {
      foundItems = await Item.find(tagPipeline);
    } else {
      foundItems = await Item.find({
        $and: [searchPipeline, tagPipeline],
      });
    }

    // If no item is found, a 404 error should be returned.
    if (foundItems.length === 0) {
      return { status: 404, message: "No items found." };
    }

    return { status: 200, message: foundItems };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const getItemRequest = async (req) => {
  if (!req.query || !req.query.type) {
    return { status: 400, message: "I don't know what you want me to do." };
  } else if (Array.isArray(req.query.type)) {
    return { status: 400, message: "DO NOT PROVIDE MULTIPLE TYPES." };
  }

  const { type } = req.query;
  let result;
  switch (type) {
    case "getItemById":
      result = await getItemByIdRequest(req);
      break;
    case "filterAndSearch":
      result = await filterAndSearchRequest(req);
      break;
    default:
      result = { status: 400, message: "No such type." };
  }
  return result;
};
/* -------------- END: GET Request --------------------- */

/* -------------- START: DELETE Request ------------------ */
const deleteItemFromDatabase = async (uid, item_id) => {
  try {
    const condition = {
      $and: [{ createdBy: uid }, { _id: item_id }, { status: "available" }],
    };
    const deletedItem = await Item.findOneAndDelete(condition);
    return deletedItem;
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteItemRequest = async (req) => {
  try {
    if (!req.headers || !req.headers.uid) {
      return { status: 401, message: "No Firebase UID provided." };
    } else if (!req.body || !req.body.item_id) {
      return { status: 400, message: "No item_id is provided in the body" };
    }

    const uid = req.headers.uid;
    const { item_id } = req.body;

    const results = await deleteItemFromDatabase(uid, item_id);
    if (!results) {
      return { status: 404, message: "No matching item found" };
    }

    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
/* ----------------- END: DELETE Request ---------------------- */

/* ----------------- START: POST Request ---------------------- */
const postItemRequest = async (req) => {
  if (!req.headers || !req.headers.uid) {
    return { status: 401, message: "No Firebase UID provided." };
  }

  try {
    const { uid } = req.headers;
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      return {
        status: 404,
        message: "No user found. Unable to proceed with posting item.",
      };
    }

    if (
      !req.body ||
      !req.body.name ||
      !req.body.description ||
      !req.body.typeOfTransaction ||
      !req.body.deliveryInformation
    ) {
      return {
        status: 400,
        message:
          "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
      };
    } else if (
      req.body.typeOfTransaction !== "RENT" &&
      req.body.typeOfTransaction !== "SELL"
    ) {
      return {
        status: 400,
        message: "Invalid type of transaction.",
      };
    }

    const { body } = req;

    const item = new Item({
      // Compulsory variables
      name: body.name,
      description: body.description,
      typeOfTransaction: body.typeOfTransaction,
      deliveryInformation: body.deliveryInformation,
      uid,
      //   Optional variables
      price: body.price ? Number(body.price) : 0,
      tags: body.tags || undefined,
      imageUrl: body.imageUrl || undefined,
      //   Computational variables
      timeCreated: Date.now(),
      durationOfRent:
        body.typeOfTransaction === "RENT" ? 7 * 24 * 60 * 60 : undefined,
      currentOwner: uid,
      offeredBy: null,
      nextAvailablePeriod: null,
    });

    await item.save();
    return { status: 201, message: item };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

// Main Cloud Function
const ItemCloudFunction = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (!connection.readyState) {
        connect(process.env.DB_URL);
      }

      let result;

      switch (req.method) {
        case "POST":
          result = await postItemRequest(req);
          break;
        case "GET":
          result = await getItemRequest(req);
          break;
        case "DELETE":
          result = await deleteItemRequest(req);
          break;
        default:
          result = { status: 405, message: "Method not allowed" };
      }
      const { status, message } = result;
      res.status(status).json({ message });
    });
  });

// Exporting the required files
exports.User = User;
exports.Item = Item;
exports.item = ItemCloudFunction;
exports.deleteItemRequest = deleteItemRequest;
exports.getItemRequest = getItemRequest;
exports.postItemRequest = postItemRequest;
