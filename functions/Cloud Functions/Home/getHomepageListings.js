require('dotenv').config();
const functions = require('firebase-functions');
const { connect, disconnect } = require('mongoose');

exports.getHomepageListings = functions.https.onCall(async (_, context) => {
  try {
    const { uid } = context.auth;
    connect(process.env.DB_URL);

    // Create a pipeline to filter out the documents that do not belong to the user
    const pipeline1 = { $match: { createdBy: { $ne: uid } } };
    let results = await Item.aggregate([pipeline1]).limit(100);

    disconnect();
    return { success: true, message: results };
  } catch (e) {
    disconnect();
    return { success: false, message: e.message };
  }
});
