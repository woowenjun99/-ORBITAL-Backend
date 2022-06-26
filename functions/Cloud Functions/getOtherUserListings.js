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
    const foundItems = await this.getListings(uid);
    return { success: true, message: foundItems };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.getListings = async (uid) => {
  try {
    const foundItems = await Item.find({ uid });
    return foundItems;
  } catch (e) {
    throw new Error(e.message);
  }
};
