require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { User } = require('../service/Model');

exports.updateParticularsForm = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in' };
    }

    const { uid } = context.auth;
    const { name, username, postal, phone, gender, address, birthday, imageURL } =
      data;
    let result;

    const foundUser = this.findUserInDatabase(uid);
    if (!foundUser) {
      result = await this.createNewUser(
        name,
        username,
        postal,
        phone,
        gender,
        address,
        uid,
        birthday,
        imageURL
      );
    } else {
      result = await this.updateFoundUser(
        name,
        username,
        postal,
        phone,
        gender,
        address,
        birthday,
        imageURL
      );
    }
    return { success: true, message: result };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.findUserInDatabase = async (uid) => {
  try {
    connect(process.env.DB_URL);
    const foundUser = await User.findOne({ uid: uid });
    return foundUser;
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.createNewUser = async (
  name,
  username,
  postal,
  phone,
  gender,
  address,
  uid,
  birthday,
  imageURL
) => {
  try {
    const user = new User({
      name,
      username,
      postal,
      phone,
      gender,
      address,
      uid,
      birthday,
      imageURL,
    });

    await user.save();
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.updateFoundUser = async (
  uid,
  name,
  username,
  postal,
  phone,
  gender,
  address,
  birthday,
  imageURL
) => {
  try {
    const foundUser = await User.findOneAndUpdate(
      { uid },
      { name, username, postal, phone, gender, address, birthday, imageURL },
      { new: true }
    );
    return foundUser;
  } catch (e) {
    throw new Error(e.message);
  }
};
