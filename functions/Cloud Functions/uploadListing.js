const functions = require('firebase-functions');
const { Item } = require('../service/Model');
const { validateListingFormInputs } = require('../service/validate_input');
const { connectDatabase } = require('../helper/connectDatabase');

/**
 * uploadListing Cloud Function
 *
 * @param {Object} data -- Containing the information passed in by the user
 * @param {Object} context -- Containing the information about the user
 */
exports.uploadListing = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in' };
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

/**
 * Saves the form in the database
 *
 * @param {String} name -- The name of the listing
 * @param {String} description -- The description of the listing
 * @param {String} typeOfTransaction -- The type of transaction
 * @param {String} deliveryInformation -- The delivery information
 * @param {Array} tags -- The tags of the object
 * @param {String} imageURL -- The url of the image
 * @param {String} uid -- The Firebase User ID
 *
 * @return Item document if successful
 * @throws Error if there is an issue saving into the DB
 */
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
    connectDatabase();
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
      status: 'available',
    });

    await item.save();
    return item;
  } catch (e) {
    throw new Error(e.message);
  }
};
