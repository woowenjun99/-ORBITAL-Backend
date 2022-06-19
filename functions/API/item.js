require('dotenv').config();
const { connect } = require('mongoose');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { Item, User } = require('../service/Model');

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
      let result;
      connect(process.env.DB_URL);
      switch (req.method) {
        case 'GET':
          const { id } = req.query;
          result = await this.findItemByID(id);
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

