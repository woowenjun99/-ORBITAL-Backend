require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

/**
 * Creates a Cloud Function that gets the user's listings
 *
 * @param {Object} context The context of the user
 * @return the list of items that belong to the user
 * @throws An issue if the user is not logged in
 * @throws An issue if there is an issue reading from the database
 */
exports.getUserListings = functions.https.onCall(async (_, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in' };
    }

    const { uid } = context.auth;
    const results = await this.findUserItemsFromDatabase(uid);

    return { success: true, message: results };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

/**
 * Use to retrieve all of the listings that were made by the user
 *
 * @param {String} uid
 * @returns The list of listings
 * @throws An issue if there is an error reading from the database
 */

exports.findUserItemsFromDatabase = async (uid) => {
  try {
    connect(process.env.DB_URL);

    // Finds the items that are created by the user
    const pipeline1 = { $match: { createdBy: uid } };

    // Sort them in descending order of timeCreated
    const results = await Item.aggregate([pipeline1]).sort('field -timeCreated');

    results.forEach((element) => {
      element._id = element._id.toString();
    });

    return results;
  } catch (e) {
    throw new Error(e.message);
  }
};
