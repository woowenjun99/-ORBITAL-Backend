require('dotenv').config();
const functions = require('firebase-functions');
const { connect, connection } = require('mongoose');
const { Item } = require('../service/Model');

/**
 * Creates a cloud function called createReservation
 *
 * Conditions to fulfil:
 * 1. User must be logged in.
 * 2. Data consists of the following parameters:
 * @param {String} item_id The id of the item
 *
 * @returns True and the foundItem if the whole process is successful
 * @throws Error if there is several issues
 *  1. User is not logged in
 *  2. No item_id is provided
 *  3. No item with the item_id is found
 *  4. The item's status is not "available"
 *  5. The person making the offer is the current owner or the original owner
 */
exports.createReservation = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      return { success: false, message: 'User is not logged in.' };
    }

    const item_id = data.item_id;
    if (!item_id) {
      return { success: false, message: 'Please provide an item id' };
    }

    const { uid } = context.auth;

    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }

    const error = await this.validateItem(item_id, uid);
    if (error) return { success: false, message: error };

    // Proceed with the transaction
    const foundItem = this.make_reservation(item_id);
    return { success: true, message: foundItem };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

/**
 * Checks the eligibility of renting
 *
 * @param {String} item_id of the item
 * @param {String} uid of the person making the offer
 * @returns Error if the error conditions are met
 */
exports.validateItem = async (item_id, uid) => {
  try {
    let error = undefined;

    const foundItem = await Item.findById(item_id);
    if (!foundItem) {
      error = 'No item found.';
    } else if (foundItem.status !== 'available') {
      error = `Item not available for ${foundItem.typeOfTransaction}.`;
    } else if (foundItem.createdBy === uid || foundItem.currentOwner === uid) {
      error = 'You cannot purchase your own item';
    }

    return error;
  } catch (e) {
    throw new Error(e.message);
  }
};

/**
 * Sets the status of the item to reserved
 *
 * @param {String} item_id The item_id of the object
 * @returns The updated item
 * @throws Error if there is an issue with updating the database
 */

exports.make_reservation = async (item_id) => {
  try {
    const foundItem = await Item.findByIdAndUpdate(
      item_id,
      { status: 'Offered', offeredBy: uid },
      { new: true }
    );

    return foundItem;
  } catch (e) {
    throw new Error(e.message);
  }
};
