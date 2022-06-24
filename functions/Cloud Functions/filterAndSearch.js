require('dotenv').config();
const functions = require('firebase-functions');
const { connect } = require('mongoose');
const { Item } = require('../service/Model');

exports.filterAndSearch = functions.https.onCall(async (data) => {
  try {
    const { tags, search } = data;
    const results = await this.findItemsInDatabase(tags, search);
    if (results.length === 0) return { success: false, message: 'No item found' };
    return { success: true, message: results };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

exports.findItemsInDatabase = async (tags, search) => {
  try {
    connect(process.env.DB_URL);
    let itemResult;
    const tagPipeline = { tags: { $all: tags } };
    const searchPipeline = { name: new RegExp(search.trim(), 'i') };

    if (!tags) {
      itemResult = await Item.find(searchPipeline);
    } else if (!search) {
      itemResult = await Item.find(tagPipeline);
    } else {
      itemResult = await Item.find({
        $and: [searchPipeline, tagPipeline],
      });
    }

    return itemResult;
  } catch (e) {
    throw new Error(e.message);
  }
};
