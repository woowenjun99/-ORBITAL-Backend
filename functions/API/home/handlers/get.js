const { model } = require("mongoose");
const { itemSchema } = require("../../../service/Schema");

const Item = new model("items", itemSchema);

const getHomeRequest = async ({ headers }) => {
  try {
    let results;
    if (!headers || !headers.uid) {
      results = await Item.find().limit(100);
    } else {
      const { uid } = headers;
      results = await Item.find({ createdBy: { $ne: uid } }).limit(100);
    }
    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};

exports.Item = Item;
exports.getHomeRequest = getHomeRequest;
