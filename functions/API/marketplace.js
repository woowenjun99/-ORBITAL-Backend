require('dotenv').config();
const { connect } = require('mongoose');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { Item } = require('../service/Model');
const { getName } = require('./item');

/**
 * Cloud Function for a the marketplace
 *
 * @param {Object} req The request body that is similar to Express
 * @param {Object} res The response body that is similar to Express
 * @returns the corresponding status code and message from the individual
 * handler.
 */
exports.marketplace = functions
  .region('asia-southeast1')
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        let result;
        connect(process.env.DB_URL);
        switch (req.method) {
          case 'GET':
            const { search, tags } = req.query;
            result = await this.searchItems(search, tags);
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
 * Used for the search bar in the marketplace page
 *
 * @param {String} search The search query
 * @returns 200 A list of documents containing the related search
 * @throws 404 If no such item is found
 * @throws 500 If there is internal server error
 */

exports.searchItems = async (search, tags) => {
  try {
    if (!search && !tags) {
      return { status: 400, message: 'Please provide a search or tag query' };
    }

    let itemResult;
    const tagPipeline = { tags: { $all: tags } };
    const searchPipeline = { name: new RegExp(search.trim(), 'i') };

    // If there is only search query
    if (!tags) {
      itemResult = await Item.find(searchPipeline);
    } else if (!search) {
      itemResult = await Item.find(tagPipeline);
    } else {
      itemResult = await Item.find({
        $and: [searchPipeline, tagPipeline],
      });
    }

    if (itemResult.length === 0) {
      return { status: 404, message: 'No results found' };
    }

    return { status: 200, message: itemResult };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
