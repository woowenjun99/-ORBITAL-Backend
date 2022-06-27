require('dotenv').config();
const functions = require('firebase-functions');
const { connect, connection } = require('mongoose');
const { Item } = require('../service/Model');

/**
 * Creates the cloud function called filterAndSearch
 *
 * Conditions:
 * 1. data must contain minimally one of the two parameters:
 * @param {String} search The name of the item
 * @param {Array} tags The tags of the item
 *
 * @returns The array of items that meets the requirement
 * @throws An error if both the tag and search are not provided.
 */
exports.filterAndSearch = functions.https.onCall(async (data) => {
  try {
    const { tags, search } = data;

    // Throw an error if both the tags and search queries are not provided
    if (!tags && !search) {
      return {
        success: false,
        message: 'Please provide either the tag or search query',
      };
    }

    // Connect to the DB if the connection is not present
    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }

    // Filter the items in the database
    const results = await this.findItemsInDatabase(tags, search);
    return { success: true, message: results };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

/**
 * Filters out the items in the database
 * 
 * @param {Array} tags The tags of the item
 * @param {String} search The name to be queried
 * @returns The list of items found
 */
exports.findItemsInDatabase = async (tags, search) => {
  try {
    let itemResult;
    const tagPipeline = { tags: { $all: tags } };
    const searchPipeline = { name: new RegExp(search.trim(), 'i') };

    if (!tags) {
      itemResult = await Item.find(searchPipeline);
    } else if (!search) {
      itemResult = await Item.find(tagPipeline);
    } else {
      itemResult = await Item.find({
        $and: [searchPipeline, tagPipeline],
      });
    }

    return itemResult;
  } catch (e) {
    throw new Error(e.message);
  }
};
