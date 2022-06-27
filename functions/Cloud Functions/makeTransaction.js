require('dotenv').config();
const { connect, connection } = require('mongoose');
const functions = require('firebase-functions');
const { Item, User, Transaction } = require('../service/Model');

exports.makeTransaction = functions.https.onCall(async (data, context) => {
  try {
    // Step 1: Checks whether the user is logged in or not.
    if (!context.auth) return { success: false, message: 'User is not logged in' };

    // Step 2: Check whether the item_id is provided
    const item_id = data.item_id;
    if (!item_id) {
      return { success: false, message: 'Please provide a valid item id' };
    }

    const { uid } = context.auth;

    //Step 3: Check whether the parameters by the user are valid.
    const { error } = await this.checkValidRequest(uid, item_id);
    if (error) return { success: false, message: error };

    return { success: true, message: 'Hi' };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

/**
 * Used to check whether the request is valid
 *
 * @param {String} uid
 * @param {String} item_id
 * @returns an error if there is an issue with the request
 */
exports.checkValidRequest = async (uid, item_id) => {
  try {
    connect(process.env.DB_URL);
    let error = null;

    // Step 1: Check whether the user is valid.
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      error = 'No user found. Please fill up the personal particular form';
    }

    // Step 2: Check whether the item is a valid item.
    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      error = 'No item found';
    }

    // Step 3: Check whether the item is available or not
    if (foundItem.status !== 'available') {
      error = 'The item is currently unavailable.';
    }

    // Step 4: Check whether the user is transacting his own item
    if (foundItem.createdBy === uid) {
      error = 'You cannot purchase your own item.';
    }
    return error;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Used to process the transaction
 */
exports.processTransaction = async (uid, item_id) => {
  // Step 1: Start the session
  const session = await connection().startSession();
  try {
    // Step 2: Start a transaction
    session.startTransaction();

    const foundItem = await Item.findById(item_id, { session });

    // Last step: Commit the transaction
    session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
    throw new Error(e.message);
  }
};
