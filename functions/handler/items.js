const { Item } = require("../service/Model");

exports.getHandler = async (res) => {
  try {
    const results = await Item.aggregate([]).limit(10);
    return res.status(200).json({ message: results });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};
