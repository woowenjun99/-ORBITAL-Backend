require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

exports.getOtherUserListings = functions.https.onCall(async (data) => {
  const uid = data.uid;
  if (!uid) {
    return { success: false, message: 'Please provide a valid user id' };
  }

  try {
    connect(process.env.DB_URL);
    const foundItems = await this.getListings(uid);
    return { success: true, message: foundItems };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.getListings = async (uid) => {
  try {
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
