require('dotenv').config();
const functions = require('firebase-functions');
const { connect, connection } = require('mongoose');
const { Item } = require('../service/Model');

exports.returnItem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { success: false, message: 'User is not logged in' };
  }

  if (!item_id) {
    return { success: false, message: 'No item_id provided' };
  }

  try {
    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.validateInput = (data, context) => {
  let error = undefined;
  const item_id = data.item_id;
  if (!context.auth) {
    error = 'No item_id provided';
  }
};
