require('dotenv').config();
const { region } = require('firebase-functions');
const { connection, connect, model } = require('mongoose');
const { itemSchema } = require('../service/Schema');
const cors = require('cors')({ origin: true });

exports.getUnavailableListings = region('asia-southeast1').https.onRequest(
  (req, res) => {
    cors(req, res, async () => {
      // Reject queries from other methods
      if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
      }

      if (!connection.readyState) {
        connect(process.env.DB_URL);
      }

      const { status, message } = await this.handler(req);
      res.status(status).json({ message: message });
    });
  }
);

/**
 * Process the data
 *
 * @param {Request} req A HTTP request
 * @returns {Object} {message, status}
 */
exports.handler = async (req) => {
  try {
    const { uid, status } = req.query;

    // 1. Reject if no uid or status is provided
    if (!uid || !status) {
      return { status: 400, message: 'Bad Request' };
    }

    const results = await this.getAllUnavailableItems(uid, status);
    if (results.length === 0) {
      return { status: 404, message: 'Not found' };
    }

    return { status: 200, message: results };
  } catch (e) {
    console.error('ERROR (getUnavailableListings): ', e.message);
    return { status: 500, message: e.message };
  }
};

/**
 * Gets the list of items that satisfy the query
 *
 * @param {string} uid The Firebase UID of the user
 * @param {string} status The status of the item
 * @returns {Array<string>} The list of items that were found
 * @throws Error if there is issue reading from the database
 */
exports.getAllUnavailableItems = async (uid, status) => {
  try {
    const Item = new model('items', itemSchema);
    // 1. Gets all the items with the status
    const query1 = { $match: { status: new RegExp(status, 'i') } };
    // 2. Gets all the items that belong to the users
    const query2 = { $match: { offeredBy: uid } };
    // 3. Sort the items based on the time they were created
    const query3 = { $sort: { timeCreated: -1 } };

    // 4. Combine all the 3 queries together
    const foundItems = await Item.aggregate([query1, query2, query3]);

    // 5. Converts all the _id to String
    foundItems.forEach((element) => {
      element._id = element._id.toString();
    });

    return foundItems;
  } catch (e) {
    throw new Error(e.message);
  }
};
