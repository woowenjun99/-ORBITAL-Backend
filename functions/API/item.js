require("dotenv").config();
const functions = require("firebase-functions");
const { connect, connection, model } = require("mongoose");
const cors = require("cors")({ origin: true });
const { userSchema, itemSchema } = require("../service/Schema");

const Item = new model("items", itemSchema);
const User = new model("users", userSchema);

const getItemByIdRequest = async ({ id }) => {
  try {
    if (!id) {
      return { status: 400, message: "No item id provided." };
    }

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

const filterAndSearchRequest = async ({ search, tags }) => {
  let searchPipeline, tagPipeline, foundItems;

  if (!search && !tags) {
    return { status: 400, message: "Please provide a search query or tags." };
  } else if (Array.isArray(search)) {
    return { status: 400, message: "Please do not provide multiple search queries" };
  }

  if (search) {
    searchPipeline = { name: new RegExp(search.trim(), "i") };
  }

  if (tags) {
    tagPipeline = { tags: { $all: tags } };
  }

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

    return { status: 200, message: foundItems };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const getItemRequest = async ({ query }) => {
  if (!query || !query.type) {
    return { status: 400, message: "I don't know what you want me to do." };
  } else if (Array.isArray(query.type)) {
    return { status: 400, message: "DO NOT PROVIDE MULTIPLE TYPES." };
  }

  const { type } = query;
  let result;
  switch (type) {
    case "getItemById":
      result = await getItemByIdRequest(query);
      break;
    case "filterAndSearch":
      result = await filterAndSearchRequest(query);
      break;
    default:
      result = { status: 400, message: "No such type." };
  }
  return result;
};

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

const deleteItemRequest = async ({ headers, body }) => {
  try {
    if (!headers || !headers.uid) {
      return { status: 401, message: "No Firebase UID provided." };
    } else if (!body || !body.item_id) {
      return { status: 400, message: "No item_id is provided in the body" };
    }

    const uid = headers.uid;
    const { item_id } = body;

    const results = await deleteItemFromDatabase(uid, item_id);
    if (!results) {
      return { status: 404, message: "No matching item found" };
    }

    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const postItemRequest = async ({ headers, body }) => {
  if (!headers || !headers.uid) {
    return { status: 401, message: "No Firebase UID provided." };
  }

  try {
    const { uid } = headers;
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      return {
        status: 404,
        message: "No user found. Unable to proceed with posting item.",
      };
    }

    if (
      !body ||
      !body.name ||
      !body.description ||
      !body.typeOfTransaction ||
      !body.deliveryInformation
    ) {
      return {
        status: 400,
        message:
          "Please check whether you input your name, description, typeOfTransaction and deliveryInformation",
      };
    } else if (
      body.typeOfTransaction !== "RENT" &&
      body.typeOfTransaction !== "SELL"
    ) {
      return {
        status: 400,
        message: "Invalid type of transaction.",
      };
    }

    const {
      name,
      description,
      typeOfTransaction,
      deliveryInformation,
      price,
      tags,
      imageURL,
    } = body;

    const item = new Item({
      // Compulsory variables
      name,
      description,
      typeOfTransaction,
      deliveryInformation,
      uid,
      //   Optional variables
      price: price ? Number(price) : 0,
      tags: tags || undefined,
      imageURL: imageURL || undefined,
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

const putItemRequest = async ({ headers, body }) => {
  if (!headers || !headers.uid) {
    return { status: 401, message: "No Firebase UID provided." };
  } else if (!body || !body.item_id) {
    return { status: 400, message: "No item_id provided" };
  }

  try {
    const { uid } = headers;
    const { item_id } = body;
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      return {
        status: 404,
        message: "No user found. Unable to proceed with update item.",
      };
    }

    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      return {
        status: 404,
        message: "No item found.",
      };
    }

    if (foundItem.createdBy !== uid) {
      return {
        status: 400,
        message: "You do not have permission to edit this item.",
      };
    }

    const {
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
    } = body;

    foundItem.name = name;
    foundItem.description = description;
    foundItem.typeOfTransaction = typeOfTransaction || "RENT";
    foundItem.price = price || 0;
    foundItem.deliveryInformation = deliveryInformation;
    foundItem.tags = tags;
    foundItem.imageURL = imageURL;
    await foundItem.save();
    return { status: 201, message: foundItem };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
/* ---------------- END: PUT REQUEST ------------- */

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
        case "PUT":
          result = await putItemRequest(req);
          break;
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
exports.putItemRequest = putItemRequest;
