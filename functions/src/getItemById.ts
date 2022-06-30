import * as dotenv from "dotenv";
dotenv.config({path: __dirname + "/.env"});
import {https} from "firebase-functions";
import {connect, connection} from "mongoose";
import {Item} from "../mongoose/item_model";
import {data, foundItem} from "../types/getItemById.type";

export const getItemByID = https.onCall(async (data: data) => {
  try {
    // 1. If no itemId is provided, reject the invocation
    if (!data.id) {
      return {success: false, message: "No item id provided"};
    }

    // 2. Extract the itemId
    const {id} = data;

    // 3. Connect to the database if the connection state is not ready
    if (!connection.readyState) {
      connect(process.env.DB_URL as string);
    }

    // 4. Find the item in the database
    const {success, message} = await findItemInDatabase(id);
    return {success, message};
  } catch (e) {
    return {success: false, message: (e as Error).message};
  }
});

export const findItemInDatabase = async (itemId: string) => {
  try {
    const foundItem: foundItem = await Item.findById(itemId);
    if (foundItem && foundItem._id) {
      foundItem._id = foundItem._id.toString();
    }
    return {success: true, message: foundItem};
  } catch (e) {
    return {success: false, message: (e as Error).message};
  }
};
