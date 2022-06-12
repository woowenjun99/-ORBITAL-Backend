const { Item } = require("../service/Model");

exports.getHandler = async (req) => {
  try {
    const results = await Item.aggregate([]).limit(10);
    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
