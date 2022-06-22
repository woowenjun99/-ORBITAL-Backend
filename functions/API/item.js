require('dotenv').config();
const { connect } = require('mongoose');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { Item, User } = require('../service/Model');
const { validateListingFormInputs } = require('./validate_input.service');

/**
 * Cloud Function for a single item
 *
 * @param {Object} req The request body that is similar to Express
 * @param {Object} res The response body that is similar to Express
 * @returns the corresponding status code and message from the individual
 * handler.
 */
exports.item = functions.region('asia-southeast1').https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      let result, id;
      connect(process.env.DB_URL);
      switch (req.method) {
        case 'GET':
          id = req.query.id;
          result = await this.findItemByID(id);
          break;

        case 'POST':
          const {
            name,
            description,
            typeOfTransaction,
            price,
            deliveryInformation,
            tags,
            imageURL,
            firebaseUID,
          } = req.body;
          result = await this.uploadListing(
            name,
            description,
            typeOfTransaction,
            price,
            deliveryInformation,
            tags,
            imageURL,
            firebaseUID
          );
          break;

        case 'DELETE':
          id = req.body.id;
          result = await this.deleteItemByID(id);
          break;

        default:
          return res.status(405).json({ message: 'Method not allowed' });
      }

      const { status, message } = result;
      return res.status(status).json({ message: message });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });
});

/**
 * Returns information about the item when query via id
 *
 * @param {ObjectID} id The objectid of the item
 * @return 200 The document of the item
 *
 * @throw 400 If the id is not provided
 * @throw 404 if no such item is found
 * @throw 500 if there is internal error
 *
 * Sample Document:
 *  _id:
 *  createdBy
 *  name
 *  price
 *  description
 *  typeOfTransaction
 *  deliveryInformation
 *  available
 *  currentOwner
 *  durationOfRent
 *  __v
 *  tags
 *  imageURL
 *  timeCreated
 */
exports.findItemByID = async (id) => {
  try {
    if (id === undefined || id === null) {
      return { status: 400, message: 'Bad Request' };
    }

    // Search for the item via the user id
    const result = await Item.findById(id);
    if (!result) {
      return { status: 404, message: 'No Item Found' };
    }

    // Data manipulation
    result.createdBy = await this.getName(result.createdBy);
    result.currentOwner = await this.getName(result.currentOwner);

    // Returns the document if successful
    return { status: 200, message: result };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

/**
 * @param {String} uid The firebase uid of the user
 * @returns the username of the user (if present). Else,
 * return "Annonymous User"
 * @throws an error if there is an issue reading from the
 * database
 */
exports.getName = async (uid) => {
  try {
    const userInfo = await User.findOne({ firebaseUID: uid });
    const username = userInfo.username || 'Annonymous User';
    return username;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Used for uploading a listing
 *
 * @param {String} name The name of the item
 * @param {String} description The description of the item
 * @param {String} typeOfTransaction The type of transaction (Rent / Sell)
 * @param {Float} price The price of the item
 * @param {Array} tags The list of tags provided by the user
 * @param {String} imageURL The url of the image
 * @param {String} firebaseUID The firebase user id of the user
 *
 * @returns 201 (Created) if the listing is successfully posted
 * @throws 400 (Bad Request) if the input provided is invalid
 * @throws 401 (Unauthorised) if the firebase uid is not provided
 * @throws 404 (Not found) If the firebase uid does not belong to anyone
 * @throws 500 (Internal Server Error) If there is any issue with the database query
 */
exports.uploadListing = async (
  name,
  description,
  typeOfTransaction,
  price,
  deliveryInformation,
  tags,
  imageURL,
  firebaseUID
) => {
  // Check if the input provided is valid
  if (!firebaseUID) {
    return { status: 400, message: 'No firebase user id provided' };
  }

  const { error } = validateListingFormInputs(
    name,
    description,
    typeOfTransaction,
    deliveryInformation
  );

  if (error) {
    return { status: 400, message: 'Bad Request: Issue with input provided' };
  }

  try {
    // Checks if the user is valid. We do not want to accept any user id
    const foundUser = await User.findOne({ firebaseUID: firebaseUID });
    if (!foundUser) {
      return { status: 404, message: 'No user found' };
    }

    const item = new Item({
      createdBy: firebaseUID,
      name: name,
      description: description,
      typeOfTransaction: typeOfTransaction,
      price: price,
      deliveryInformation: deliveryInformation,
      available: true,
      imageURL: imageURL === null ? undefined : imageURL,
      tags: tags,
      timeCreated: Date.now(),
      durationOfRent: 7 * 24 * 60 * 60,
      currentOwner: firebaseUID,
    });

    await item.save();

    return { status: 200, message: item };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

/**
 *
 * @param {String} name
 * @param {String} description
 * @param {String} typeOfTransaction
 * @param {String} deliveryInformation
 * @returns a schema validation
 */
