require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

exports.updateItem = functions.https.onCall(async (data, context) => {
  // Checks if the user is logged in
  if (!context.auth) {
    return { success: false, message: 'You are not signed in.' };
  }

  const { uid } = context.auth;
  const {
    name,
    description,
    typeOfTransaction,
    price,
    deliveryInformation,
    tags,
    imageURL,
    item_id,
  } = data;

  if (!item_id) return { success: false, message: 'Please provide the item id' };
  try {
    const foundItem = await this.updateItemInDatabase(
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
      item_id,
      uid
    );

    return { success: true, message: foundItem };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.updateItemInDatabase = async (
  name,
  description,
  typeOfTransaction,
  price,
  deliveryInformation,
  tags,
  imageURL,
  item_id,
  uid
) => {
  try {
    connect(process.env.DB_URL);
    const foundItem = await Item.findById(item_id);
    if (foundItem.createdBy !== uid) {
      throw new Error('You do not have permission to edit this item.');
    }

    foundItem.name = name;
    foundItem.description = description;
    foundItem.typeOfTransaction = typeOfTransaction;
    foundItem.price = price;
    foundItem.deliveryInformation = deliveryInformation;
    foundItem.tags = tags;
    foundItem.imageURL = imageURL;

    await foundItem.save();
    return foundItem;
  } catch (e) {
    throw new Error(e.message);
  }
};
