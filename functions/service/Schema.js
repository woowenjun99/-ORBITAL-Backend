const { Schema } = require("mongoose");

exports.userSchema = new Schema({
  name: String,
  username: String,
  phone: String,
  postal: String,
  address: String,
  gender: String,
  dob: Number,
  profilePicRoute: String,
  firebaseUID: {
    required: true,
    type: String,
  },
});

exports.transactionSchema = new Schema({
  boardGameID: { required: true, type: Number },
  price: { required: true, type: Number },
  originalOwner: { required: true, type: String },
  nextOwner: { required: true, type: String },
  dateTimeTransacted: { required: true, type: Number },
  rentalPeriod: { required: true, type: Number },
});

exports.communitySchema = new Schema({
  id: Number,
  dateCreated: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: { required: true, type: String },
  imageUrl: String,
  posts: [{ type: String }],
  members: [{ type: String }],
});

exports.eventSchema = new Schema({
  id: String,
  members: [{ type: String }],
  imageUrl: String,
  leaderboard: [{ type: Map, of: String }],
  dateStart: Number,
  dateEnd: Number,
  name: { required: true, type: String },
});
