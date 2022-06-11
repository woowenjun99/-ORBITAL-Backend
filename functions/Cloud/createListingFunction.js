require("dotenv").config();
const functions = require("firebase-functions");
const { Item } = require("../service/Model");
const { connect } = require("mongoose");

exports.createItem = functions.https.onCall(async (data, context) => {
  try {
    // Connect to the database
    connect(process.env.DB_URL);
    const {
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
    } = data;

    const userID = context.auth.uid;

    if (userID === undefined || userID === null) {
      return { success: false, message: "User is not logged in." };
    }

    const item = new Item({
      createdBy: userID,
      name: name,
      price: price,
      description: description,
      typeOfTransaction: typeOfTransaction,
      deliveryInformation: deliveryInformation,
      available: true,
      currentOwner: userID,
      durationOfRent: typeOfTransaction === "Rent" ? 7 * 24 * 60 * 60 : 0, // 2 weeks
      tags: tags,
      imageURL: imageURL,
    });

    await item.save();
    return { success: true, message: "Successfully saved item" };
  } catch (e) {
    return { success: false, message: e.message };
  }
});
