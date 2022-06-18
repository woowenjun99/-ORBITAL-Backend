require('dotenv').config();
const { connect } = require('mongoose');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { Item } = require('../service/Model');

exports.getUserListing = functions
  .region('asia-southeast1')
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        connect(process.env.DB_URL);
        let result;

        switch (req.method) {
          case 'GET':
            const { user } = req.query;
            result = await this.getUserListingFunction(user);
            break;

          default:
            return res.status(405).json({ message: 'Invalid route' });
        }

        const { status, message } = result;
        return res.status(status).json({ message: message });
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    });
  });

/**
 * Gets a list of items that the user has posted
 *
 * @param {String} userID The firebase userid of the logged in user
 *
 * @returns 200 if the user listing can be found, be it empty or not
 * @throws 401 error if the user's identity is unknown
 * @throws 404 error if the userID does not exist in the database
 * @throws 500 error if there is an error looking up in the database
 */
exports.getUserListingFunction = async (userID) => {
  try {
    if (userID === null || userID === undefined) {
      return {
        status: 401,
        message: 'Unauthorized',
      };
    }

    const result = await Item.findOne({ createdBy: userID });
    if (!result) {
      return {
        status: 404,
        message: 'Not found',
      };
    }
    return { status: 200, message: result };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
