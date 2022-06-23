const { home } = require('./API/home');
const { item } = require('./API/item');
const { getUserListing } = require('./API/history');
const { marketplace } = require('./API/marketplace');
const { getHomepageListings } = require('./Cloud Functions/getHomepageListings');

/// HTTP Requests for Marcus
exports.home = home;
exports.item = item;
exports.getUserListing = getUserListing;
exports.marketplace = marketplace;
exports.getHomepageListings = getHomepageListings;
