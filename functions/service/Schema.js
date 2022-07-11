const { Schema, Types } = require("mongoose");

exports.userSchema = new Schema({
  name: String,
  username: String,
  phone: String,
  postal: String,
  address: String,
  gender: String,
  dob: Number,
  uid: { type: String, required: true },
  birthday: Number,
  imageURL: String,
});

exports.transactionSchema = new Schema({
  boardGameId: { required: true, type: String },
  price: { required: true, type: Number },
  originalOwner: { required: true, type: String },
  nextOwner: { required: true, type: String },
  dateTimeTransacted: { required: true, type: Number },
  nextAvailablePeriod: Number,
});

exports.itemSchema = new Schema({
  createdBy: String,
  name: String,
  price: Number,
  description: String,
  typeOfTransaction: String,
  deliveryInformation: String,
  currentOwner: String,
  durationOfRent: Number,
  tags: [String],
  imageURL: [String],
  timeCreated: Number,
  status: String,
  offeredBy: String,
  nextAvailablePeriod: Number,
  transactionNumber: String,
});
