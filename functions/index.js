const { item } = require('./API/item');
const { getHomepageListings } = require('./Cloud Functions/getHomepageListings');
const { getItemById } = require('./Cloud Functions/getItemById');
const { getUserListings } = require('./Cloud Functions/getUserListings');
const { filterAndSearch } = require('./Cloud Functions/filterAndSearch');
const { uploadListing } = require('./Cloud Functions/uploadListing');
const { makeTransaction } = require('./Cloud Functions/makeTransaction');
const { getUserInfo } = require('./Cloud Functions/getUserInfo');

/// HTTP Requests for Marcus
exports.item = item;

// Cloud Functions
exports.getHomepageListings = getHomepageListings;
exports.getItemById = getItemById;
exports.getUserListings = getUserListings;
exports.filterAndSearch = filterAndSearch;
exports.uploadListing = uploadListing;
exports.makeTransaction = makeTransaction;
exports.getUserInfo = getUserInfo;
