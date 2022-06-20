const { Item } = require("../service/Model");

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

