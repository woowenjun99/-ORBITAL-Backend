const { Item } = require("../service/Model");

/**
 * GET: Returns 100 of the listings that are created
 * within the past 7 days. The purpose of this is to
 * replicate the list of items that is being created
 * in the past 7 days.
 */
exports.getHandler = async (req) => {
  try {
    const firebaseUID = req.query.user;

    // Filters out all of the documents that do not belong to the
    // user (if he is logged in)
    const pipeline1 = { $match: { createdBy: { $ne: firebaseUID } } };

    // Combine the 2 pipelines into a single aggregate
    let results = await Item.aggregate([pipeline1]).limit(100);

    return { status: 200, message: results };
  } catch (e) {
    return { status: 500, message: e.message };
  }
};
