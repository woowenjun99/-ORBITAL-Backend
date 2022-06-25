require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { User } = require('../service/Model');

exports.getUserInfo = functions.https.onCall(async (_, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in' };
    }

    const { uid } = context.auth;
    const foundUser = await this.findUserInDatabase(uid);
    return { success: true, message: foundUser };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.findUserInDatabase = async (uid) => {
  try {
    connect(process.env.DB_URL);
    const foundUser = await User.findOne({ firebaseUID: uid });
    if (!foundUser) {
      throw new Error('No user found');
    }
    return foundUser;
  } catch (e) {
    throw new Error(e.message);
  }
};
