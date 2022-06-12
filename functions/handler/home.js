const { Item } = require("../service/Model");

exports.getHandler = async (req) => {
  try {
    const firebaseUID = req.query.user;

    // Filters out all of the documents that do not belong to the
    // user (if he is logged in)
    const pipeline1 = { $match: { createdBy: { $ne: firebaseUID } } };

    let results = await Item.aggregate([pipeline1]).limit(100);

    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
