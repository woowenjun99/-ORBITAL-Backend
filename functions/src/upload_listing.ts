import * as dotenv from "dotenv";
dotenv.config({path: __dirname + "/.env"});
import {region, https} from "firebase-functions";
import {body} from "../types/upload_listing.type";
import * as Joi from "joi";
import {connect, connection, HydratedDocument} from "mongoose";
import {Item, IItem} from "../mongoose/item_model";

export const uploadListingFunction = region("asia-southeast1").https.onCall(
    async (data: body, context: https.CallableContext) => {
      try {
      // 1. Check whether the user is logged in.
        if (!context.auth) {
          return {success: false, message: "You are not logged in."};
        }

        // 2. Extract the relevant variables
        const {
          name,
          price,
          description,
          typeOfTransaction,
          deliveryInformation,
          tags,
          imageURL,
        } = data;

        const {uid} = context.auth;

        // 3. Validate the input given by the users
        const {error} = validateListingFormInputs(
            name,
            description,
            typeOfTransaction,
            deliveryInformation
        );

        if (error) {
          return {success: false, message: error.details[0].message};
        }

        // 4. Connect to the database if the connection is not in readystate
        if (!connection.readyState) {
          connect(process.env.DB_URL as string);
        }

        // 5. Save the item in the database
        const {success, message} = await saveItemIntoDatabase(
            name,
            price,
            description,
            typeOfTransaction,
            deliveryInformation,
            tags,
            imageURL,
            uid
        );

        return {success, message};
      } catch (e) {
        return {success: false, message: (e as Error).message};
      }
    }
);

/**
 * Validates the input given by the user
 *
 * @param {string} name The name of the item
 * @param {string} description The description of the item
 * @param {string} typeOfTransaction The type of transaction involved
 * @param {string} deliveryInformation The delivery information
 * @return {Joi.ValidationResult} Joi.validation result
 */
export const validateListingFormInputs = (
    name: string,
    description: string,
    typeOfTransaction: string,
    deliveryInformation: string
) => {
  const schema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    typeOfTransaction: Joi.string().required(),
    deliveryInformation: Joi.string().required(),
  });

  return schema.validate({
    name: name,
    description: description,
    typeOfTransaction: typeOfTransaction,
    deliveryInformation: deliveryInformation,
  });
};

/**
 * Uploads the item into the database
 *
 * @param {string} name The name of the item
 * @param {number} price The price of the item
 * @param {string} description The description of the item
 * @param {string} typeOfTransaction The type of transaction
 * @param {string} deliveryInformation The information about the delivery
 * @param {Array<string>} tags The list of tags
 * @param {string} imageURL The url of the image
 * @param {string} uid The firebase user id
 * @return {Object} The success status and the item document
 */
export const saveItemIntoDatabase = async (
    name: string,
    price: number,
    description: string,
    typeOfTransaction: string,
    deliveryInformation: string,
    tags: Array<string>,
    imageURL: string,
    uid: string
) => {
  try {
    const item: HydratedDocument<IItem> = new Item({
      name,
      createdBy: uid,
      price,
      description,
      typeOfTransaction,
      deliveryInformation,
      tags,
      imageURL,
      status: "available",
      nextAvailableDate: null,
      offeredBy: null,
      timeCreated: Date.now(),
      rentalPeriod: typeOfTransaction === "Rent" ? 604800 : null,
      currentOwner: uid,
    });

    await item.save();
    return {success: true, message: "Successfully saved"};
  } catch (e) {
    return {success: false, message: (e as Error).message};
  }
};
