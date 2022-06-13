const { Item } = require("../service/Model");
const Joi = require("joi");

function validateInput(
  name,
  description,
  typeOfTransaction,
  price,
  deliveryInformation,
  firebaseUID
) {
  const schema = Joi.object({
    name: Joi.required(),
    description: Joi.required(),
    typeOfTransaction: Joi.required(),
    price: Joi.number().required(),
    deliveryInformation: Joi.required(),
    firebaseUID: Joi.required(),
  });

  return schema.validate({
    name: name,
    description: description,
    typeOfTransaction: typeOfTransaction,
    price: price,
    deliveryInformation: deliveryInformation,
    firebaseUID: firebaseUID,
  });
}

exports.postHandler = async (req) => {
  try {
    const {
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      tags,
      imageURL,
      firebaseUID,
    } = req.body;

    /// Using the JOI package to validate the inputs given by the user
    const { error } = validateInput(
      name,
      description,
      typeOfTransaction,
      price,
      deliveryInformation,
      firebaseUID
    );

    if (error) {
      return { status: 400, message: error.message };
    }

    /// Attempts to update the user
    const item = new Item({
      createdBy: firebaseUID,
      name: name,
      description: description,
      typeOfTransaction: typeOfTransaction,
      price: price,
      deliveryInformation: deliveryInformation,
      available: true,
      imageURL: imageURL === null ? undefined : imageURL,
      tags: tags,
      timeCreated: Date.now(),
      durationOfRent: 7 * 24 * 60 * 60,
      currentOwner: firebaseUID,
    });

    await item.save();

    return { status: 200, message: item };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

exports.getHandler = async (req) => {
  const tags = req.query;
};
