require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { User } = require('../service/Model');
const { uploadImage } = require('../helper/s3');

exports.updateParticularsForm = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in' };
    }

    const { uid } = context.auth;
    const { name, username, postal, phone, gender, address, birthday, imageURL } =
      data;

    const user = await this.createNewUser(
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

    return { success: true, message: user };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

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
    connect(process.env.DB_URL);
    const foundUser = await User.findOne({ uid: uid });
    let user = undefined;

    if (!foundUser) {
      user = new User({
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
    } else {
      foundUser.name = name;
      foundUser.username = username;
      foundUser.postal = postal;
      foundUser.phone = phone;
      foundUser.gender = gender;
      foundUser.address = address;
      foundUser.uid = uid;
      foundUser.birthday = birthday;
      foundUser.imageURL = imageURL;

      await foundUser.save();
      user = foundUser;
    }

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
