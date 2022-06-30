require('dotenv').config();
const { connect, connection, model } = require('mongoose');
const functions = require('firebase-functions');
const { itemSchema, transactionSchema, userSchema } = require('../service/Schema');

// Creating the Mongoose model here for easy catching
const Item = new model('items', itemSchema);
const User = new model('users', userSchema);
const Transaction = new model('transactions', transactionSchema);

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
    const error = await this.checkValidRequest(uid, item_id);
    if (error) return { success: false, message: error };

    const transaction = await this.processTransaction(uid, item_id);

    return { success: true, message: transaction };
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
      // 3. Checks if the item exists
      error = 'No item found';
    } else if (foundItem.status !== 'offered' && foundItem.offeredBy !== uid) {
      // 4. Checks whether
      error = 'You have not made an offer for this item.';
    } else if (foundItem.createdBy && foundItem.createdBy === uid) {
      error = 'You cannot purchase your own item.';
    } else if (foundItem.status && foundItem.status !== 'available') {
      error = 'This item is currently not available.';
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

    /** --- foundItem logic --- **/
    const foundItem = await Item.findById(item_id, { session });
    if (foundItem.typeOfTransaction === 'Rent') {
      foundItem.status = 'on-loan';
    } else {
      foundItem.status = 'sold';
    }
    foundItem.currentOwner = uid;
    await foundItem.save({ session });

    /** --- Transaction logic --- */
    const transaction = new Transaction({
      boardGameID: item_id,
      price: foundItem.price,
      originalOwner: foundItem.createdBy,
      nextOwner: uid,
      dateTimeTransacted: Date.now(),
      nextAvailablePeriod:
        foundItem.typeOfTransaction === 'Rent'
          ? Date.now() + foundItem.durationOfRent
          : null,
    });

    await transaction.save({ session });

    // Last step: Commit the transaction
    session.commitTransaction();
    return transaction;
  } catch (e) {
    await session.abortTransaction();
    throw new Error(e.message);
  }
};
