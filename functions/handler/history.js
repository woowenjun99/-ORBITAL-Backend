const { Item } = require("../service/Model");

exports.getHandler = async (req) => {
  try {
    // Gets the userid from the query
    const userID = req.query.user;

    if (userID === null || userID === undefined) {
      return {
        status: 404,
        message: "You do not have permission to view this page",
      };
    }

    const result = await Item.aggregate([{ $match: { createdBy: userID } }]);

    return { status: 200, message: result };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
