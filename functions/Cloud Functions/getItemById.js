require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

exports.getItemById = functions.https.onCall(async (data) => {
  try {
    const id = data.id;
    if (!id) return { success: false, message: 'No id provided' };
    const foundItem = await this.findDatabaseForItem(id);
    if (!foundItem) return { success: false, message: 'No item found' };
    foundItem._id = foundItem._id.toString();
    return { sucess: true, message: foundItem };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.findDatabaseForItem = async (id) => {
  try {
    connect(process.env.DB_URL);
    const foundItem = await Item.findById(id);
    return foundItem;
  } catch (e) {
    throw new Error(e.message);
  }
};