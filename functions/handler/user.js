const { User } = require("../service/Model");

/**
 * POST "/user"
 * Adds a user document to the database
 * 
 * @param {Object} req 
 * @returns status code 201 and the user document
 */
exports.postHandler = async (req) => {
  try {
    const { firebaseUID } = req.body;
    if (!firebaseUID) {
      return {status: 401, message: "You do not have the permission to view this page."}
    }

    const foundUser = await User.findOne({ firebaseUID: firebaseUID });
    if (foundUser) {
      return { status: 409, message: "User already exists" };
    }

    const user = new User({ firebaseUID: firebaseUID });
    await user.save();
    return { status: 201, message: user };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

/**
 * GET "/user"
 * required query: firebase_user_id
 * Gets the user document.
 *
 * @param {Object} req -- Request Object body
 * @returns status code 200 and the user object if any.
 */
exports.getHandler = async (req) => {
  try {
    const userID = req.query.user;

    if (!userID) {
      return {
        status: 401,
        message: "You do not have sufficient permission to view this page",
      };
    }

    const foundUser = await User.findOne({ firebaseUID: userID });
    if (!foundUser) {
      return { status: 404, message: "No such user" };
    }

    return { status: 200, message: foundUser };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

/**
 * PUT "/user"
 * Updates the user document in the database
 *
 * @param {Object} req -- Request Object body
 * @returns status code 201 and a "successful message"
 */
exports.putHandler = async (req) => {
  try {
    const { name, username, postal, phone, firebaseUID, gender, address } = req.body;

    if (!firebaseUID) {
      return { status: 400, message: "Invalid request" };
    }

    const filter = { firebaseUID: firebaseUID };
    const update = {
      name: name,
      username: username,
      postal: postal,
      phone: phone,
      gender: gender,
      address: address,
    };

    const foundUser = await User.findOneAndUpdate(filter, update, { new: true });
    return { status: 201, message: foundUser };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
