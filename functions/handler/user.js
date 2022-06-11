const { User } = require("../service/Model");

exports.postHandler = async (req) => {
  try {
    // Retrieve the relevant information from the database
    const { firebaseUID } = req.body;

    // Checks if the user already exist. If it does, throw an error
    const foundUser = await User.findOne({ firebaseUID: firebaseUID });
    if (foundUser) {
      return { status: 400, message: "User already exists" };
    }

    const user = new User({
      firebaseUID: firebaseUID,
    });

    // Saving the user information
    await user.save();

    return { status: 200, message: user };
  } catch (e) {
    return { status: 500, message: e };
  }
};

exports.getHandler = async (req) => {
  try {
    const userID = req.query.user;

    // Checks if the request is valid
    if (!userID) {
      return { status: 404, message: "Invalid request" };
    }

    const foundUser = await User.findOne({ firebaseUID: userID });
    if (!foundUser) {
      return { status: 400, message: "No such user" };
    }
    return { status: 200, message: foundUser };
  } catch (e) {
    return { status: 500, message: e };
  }
};

exports.putHandler = async (req) => {
  try {
    const { name, username, postal, phone, firebaseUID, gender, address } =
      req.body;

    // If firebaseUID is not provided, instantly reject the request.
    if (!firebaseUID) {
      return { status: 400, message: "Invalid request" };
    }

    // If there is no such user in the DB, immediately reject it.
    const foundUser = await User.findOne({ firebaseUID });
    if (!foundUser) {
      return { status: 404, message: "No user found" };
    }

    // Update the foundUser object with the updated data.
    foundUser.name = name;
    foundUser.username = username;
    foundUser.postal = postal;
    foundUser.phone = phone;
    foundUser.gender = gender;
    foundUser.address = address;

    // Save the updated foundUser object
    await foundUser.save();
    return { status: 200, message: foundUser };
  } catch (e) {
    return { status: 500, message: "Something went wrong" };
  }
};
