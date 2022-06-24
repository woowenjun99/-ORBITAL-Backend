require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

/**
 *  Creates a Cloud Function called getHomepageListings
 *
 * @param {Object} context FirebaseAuth.currentUser (if logged in)
 * @returns The list of items inside of the items collections
 * @throws An error if there is an issue reading from the database
 */

exports.getHomepageListings = functions.https.onCall(async (_, context) => {
  try {
    let uid = null;
    if (context.auth) {
      uid = context.auth.uid;
    }
    const results = await this.getListingsFromDatabase(uid);
    return { success: true, message: results };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

/**
 * To READ the data from the database
 * 
 * @param {String} uid The firebase uid of the user
 * @returns The list of items in the item document
 * @throws An error when there is an issue reading from the database
 */

exports.getListingsFromDatabase = async (uid) => {
  try {
    let results;
    connect(process.env.DB_URL);

    // [NOTE 1] Return a list of up to 100 items
    if (!uid) {
      results = await Item.aggregate([]).limit(100);
    } else {
      const pipeline1 = { $match: { createdBy: { $ne: uid } } };
      results = await Item.aggregate([pipeline1]).limit(100);
    }

    // [NOTE 2] Converts the Hex of the ObjectID to String
    results.forEach((element) => {
      element._id = element._id.toString();
    });

    return results;
  } catch (e) {
    throw new Error(e.message);
  }
};
