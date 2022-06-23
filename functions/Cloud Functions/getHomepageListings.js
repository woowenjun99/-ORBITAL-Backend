/**
 * @author: Wen Jun
 * @since 0.0.0
 *
 * COHESION: High. This file contains all of the modules for
 * getHomepageListings functions.
 */

require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

/**
 * Single Responsibility: Creates a Cloud Function called getHomepageListings
 *
 * Single thing to change: The type of platform (From GCP to Express)
 *
 * Coupling: Loose. We can change the database in the getListingsFromDatabase
 * and this will still work after several modifications
 *
 * @param {Object} context FirebaseAuth.currentUser (if logged in)
 *
 * @returns The list of items inside of the items collections
 *
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
 * Single Responsibility: To READ the data from the database
 *
 * Single Thing to Change: The type of database used
 *
 * Coupling: Loose. We can change the platform from GCP to
 * Express and this function will still work.
 *
 * @param {String} uid The firebase uid of the user
 *
 * @returns The list of items in the item document
 *
 * @throws An error when there is an issue reading from the database
 */

exports.getListingsFromDatabase = async (uid) => {
  try {
    let results = null;
    connect(process.env.DB_URL);
    if (!uid) {
      results = await Item.aggregate([]).limit(100);
    } else {
      const pipeline1 = { $match: { createdBy: { $ne: uid } } };
      results = await Item.aggregate([pipeline1]).limit(100);
    }
    return results;
  } catch (e) {
    throw new Error(e.message);
  }
};
