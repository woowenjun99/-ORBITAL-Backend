require('dotenv').config();
const { connect, connection, model } = require('mongoose');
const functions = require('firebase-functions');
const { itemSchema, transactionSchema, userSchema } = require('../service/Schema');
const cors = require('cors')({ origin: true });

// Creating the Mongoose model here for easy catching
const Item = new model('items', itemSchema);
const User = new model('users', userSchema);
const Transaction = new model('transactions', transactionSchema);

exports.makeTransaction = functions
  .region('asia-southeast1')
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
      }

      const { status, message } = await this.handler(req);
      res.status(status).json({ message: message });
    });
  });

exports.handler = async (req) => {
  try {
    // 1. Validate the input provided by the user.
    const { uid, item_id } = req.body;
    if (!uid || !item_id) {
      return { status: 400, message: 'Bad Request' };
    }

    // 2. Connect to the database
    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }

    // 3. Validates if the item is available for transaction
    const { status, error } = await this.checkValidRequest(uid, item_id);
    if (error) {
      return { status: status, message: error };
    }

    // 4. Proceeed with the transaction
    const transaction = await this.processTransaction(uid, item_id);
    if (!transaction) {
      return { status: 404, message: 'Item not found' };
    }
    return { status: 200, message: transaction };
  } catch (e) {
    console.error('ERROR (makeTransaction) :', e.message);
    return { status: 500, message: e.message };
  }
};

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
    let error,
      status = null;

    // Step 1: Check whether the user is valid.
    const foundUser = await User.findOne({ uid });
    if (!foundUser) {
      error = 'No user found. Please fill up the personal particular form';
    }

    // Step 2: Check whether the item is a valid item.
    const foundItem = await Item.findById(item_id);

    if (!foundItem) {
      // Step 3: Item not found.
      error = 'No item found.';
      status = 404;
    } else if (!foundItem.status) {
      // Step 4: Due to some legacy code, we might have to manually update the status
      foundItem.status = 'available';
      await foundItem.save();
      error = 'Something went wrong. Please try and refresh';
      status = 400;
    } else if (foundItem.status === 'available') {
      // Step 5: No offer had been made for the item yet
      error = 'No offer had been made for this item yet';
      status = 400;
    } else if (foundItem.status === 'offered' && foundItem.offeredBy !== uid) {
      error = 'Someone had made an offer for this offer.';
      status: 400;
    } else if (foundItem.createdBy === uid && foundItem.currentOwner === uid) {
      error = 'You cannot purchase your own item.';
      status = 400;
    } else if (foundItem.status === 'Sold' || foundItem.status === 'Rented') {
      error = 'This item is already rented out or sold.';
      status = 400;
    }

    return { status, error };
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Used to process the transaction
 */
exports.processTransaction = async (uid, item_id) => {
  // Step 1: Start the session
  const session = await connection.startSession();
  try {
    // Step 2: Start a transaction
    session.startTransaction();

    /** --- foundItem logic --- **/
    const foundItem = await Item.findById(item_id, null, { session });
    if (!foundItem) {
      return null;
    }

    foundItem.currentOwner = uid;

    if (foundItem.typeOfTransaction === 'Rent') {
      if (foundItem.durationOfRent) {
        foundItem.nextAvailablePeriod = foundItem.nextAvailablePeriod + Date.now();
      } else {
        // Set as 2 weeks to default if no n
        foundItem.durationOfRent = 604800;
        foundItem.nextAvailablePeriod = 604800 + Date.now();
      }
      foundItem.status = 'Rented';
    } else {
      foundItem.status = 'Sold';
    }

    await foundItem.save({ session });

    const transaction = new Transaction({
      boardGameId: foundItem._id.toString(),
      price: foundItem.price,
      originalOwner: foundItem.createdBy,
      nextOwner: uid,
      dateTimeTransacted: Date.now(),
      nextAvailablePeriod: foundItem.nextAvailablePeriod,
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
