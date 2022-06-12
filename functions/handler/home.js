const { Item } = require("../service/Model");

exports.getHandler = async (req) => {
  try {
    const firebaseUID = req.query.user;

    let results = await Item.aggregate([
      { $match: { createdBy: { $ne: firebaseUID } } },
    ]).limit(100);

    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
