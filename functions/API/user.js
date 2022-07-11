require("dotenv").config();
const functions = require("firebase-functions");
const { connect, connection, model } = require("mongoose");
const cors = require("cors")({ origin: true });
const { userSchema, itemSchema } = require("../service/Schema");

const User = new model("users", userSchema);
const Item = new model("items", itemSchema);

const getUserRequest = async ({ headers }) => {
  if (!headers || !headers.uid) {
    return { status: 400, message: "Please provide a uid." };
  }
  try {
    const { uid } = headers;
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      return { status: 404, message: "No user found." };
    }

    foundUser._id = foundUser._id.toString();

    const foundItems = await Item.find({ createdBy: uid });
    foundItems.forEach((element) => {
      element._id = element._id.toString();
    });

    foundUser.items = foundItems;
    return { status: 200, message: foundUser };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const putUserRequest = async ({ headers, body }) => {
  if (!headers || !headers.uid) {
    return { status: 400, message: "Please provide a uid." };
  } else if (!body) {
    return { status: 400, message: "Please pass in a field." };
  }

  const { name, username, postal, phone, gender, address, birthday, imageURL } =
    body;

  const { uid } = headers;

  try {
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      const newUser = new User({
        name,
        username,
        phone,
        postal,
        gender,
        address,
        uid,
        birthday,
        imageURL,
      });

      await newUser.save();
      return { status: 201, message: newUser };
    }

    foundUser.name = name;
    foundUser.username = username;
    foundUser.postal = postal;
    foundUser.address = address;
    foundUser.birthday = birthday;
    foundUser.imageURL = imageURL;
    await foundUser.save();

    return { status: 201, message: foundUser };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

const UserFunction = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (!connection.readyState) {
        connect(process.env.DB_URL);
      }

      let result;
      switch (req.method) {
        case "GET":
          result = await getUserRequest(req);
          break;
        case "PUT":
          result = await putUserRequest(req);
          break;
        default:
          result = { status: 405, message: "Method not allowed" };
      }
      const { status, message } = result;
      res.status(status).json({ message });
    });
  });

exports.User = User;
exports.Item = Item;
exports.user = UserFunction;
exports.getUserRequest = getUserRequest;
exports.putUserRequest = putUserRequest;
