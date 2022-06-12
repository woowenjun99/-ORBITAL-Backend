const { Schema } = require("mongoose");

exports.userSchema = new Schema({
  name: String,
  username: String,
  phone: String,
  postal: String,
  address: String,
  gender: String,
  dob: Number,
  firebaseUID: { type: String, required: true },
});

exports.transactionSchema = new Schema({
  boardGameID: { required: true, type: Number },
  price: { required: true, type: Number },
  originalOwner: { required: true, type: String },
  nextOwner: { required: true, type: String },
  dateTimeTransacted: { required: true, type: Number },
  rentalPeriod: { required: true, type: Number },
});

exports.itemSchema = new Schema({
  createdBy: String,
  name: String,
  price: Number,
  description: String,
  typeOfTransaction: String,
  deliveryInformation: String,
  available: Boolean,
  currentOwner: String,
  durationOfRent: Number,
  tags: [String],
  imageURL: String,
  dateCreated: Number,
});
