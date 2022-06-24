require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');
const { validateListingFormInputs } = require('../API/validate_input');

exports.uploadListing = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) return { success: false, message: 'User is not logged in' };
    const { uid } = context.auth;

    const {
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
    } = data;

    const { error } = validateListingFormInputs(
      name,
      description,
      typeOfTransaction,
      deliveryInformation
    );

    if (error) return { success: false, message: error };

    const item = await this.uploadDataIntoDatabase(
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
      uid
    );

    return { success: true, message: item };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.uploadDataIntoDatabase = async (
  name,
  description,
  typeOfTransaction,
  price,
  deliveryInformation,
  tags,
  imageURL,
  uid
) => {
  try {
    connect(process.env.DB_URL);
    const item = new Item({
      createdBy: uid,
      name: name,
      description: description,
      typeOfTransaction: typeOfTransaction,
      price: price,
      deliveryInformation: deliveryInformation,
      available: true,
      imageURL: imageURL,
      tags: tags,
      timeCreated: Date.now(),
      durationOfRent: 7 * 24 * 60 * 60,
      currentOwner: uid,
    });

    await item.save();
    return item;
  } catch (e) {
    throw new Error(e.message);
  }
};
