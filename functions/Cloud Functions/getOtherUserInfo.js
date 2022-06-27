require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { User, Item } = require('../service/Model');

exports.getAnotherUserInfo = functions.https.onCall(async (data) => {
  const uid = data.uid;
  if (!uid) return { success: false, message: 'Please provide a uid' };

  try {
    const foundUser = await this.findUserInDatabase(uid);
    return { success: true, message: foundUser };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.findUserInDatabase = async (uid) => {
  try {
    connect(process.env.DB_URL);
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      throw new Error('No user found');
    }

    const foundItem = await Item.find({ uid });
    if (foundItem) {
      foundItem.forEach((element) => {
        element._id = element._id.toString();
      });
      foundUser.listings = foundItem;
    }

    return foundUser;
  } catch (e) {
    throw new Error(e.message);
  }
};
