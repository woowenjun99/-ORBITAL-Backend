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

exports.itemSchema = new Schema({
  id: String,
  createdBy: String,
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
    default: 0,
  },
  description: {
    required: true,
    type: String,
  },
  review: Object,
  typeOfTransaction: String,
  deliveryInformation: String,
  tags: [{ type: String }],
  conditionOfItem: String,
  available: Boolean,
  boardGameID: String,
  imageUrl: String,
  currentOwner: { type: String, required: true },
  durationOfRent: Number,
});
