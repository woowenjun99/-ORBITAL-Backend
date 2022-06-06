const { User } = require("../service/Model");

exports.postHandler = async (req, res) => {
  try {
    // Retrieve the relevant information from the database
    const { firebaseUID } = req.body;

    // Checks if the user already exist. If it does, throw an error
    const foundUser = await User.findOne({ firebaseUID: firebaseUID });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firebaseUID: firebaseUID,
    });

    // Saving the user information
    await user.save();

    return res.status(200).json({ message: user });
  } catch (e) {
    return res.status(500).json({ e });
  }
};

exports.getHandler = async (req, res) => {
  try {
    const userID = req.query.user;

    if (!userID) {
      return res.status(404).json({ message: "Invalid request" });
    }

    const foundUser = await User.findOne({ firebaseUID: userID });
    if (!foundUser) {
      return res.status(400).json({ message: "No such user found" });
    }
    return res.status(200).json({ message: foundUser });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

exports.putHandler = async (req, res) => {
  try {
    const { name, username, postal, phone, firebaseUID, gender, address } =
      req.body;

    // If firebaseUID is not provided, instantly reject the request.
    if (!firebaseUID) {
      return res.status(404).json({ message: "Invalid request" });
    }

    // If there is no such user in the DB, immediately reject it.
    const foundUser = await User.findOne({ firebaseUID });
    if (!foundUser) {
      return res.status(404).json({ error: "No user found" });
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
    return res.status(200).json({ message: foundUser });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};
