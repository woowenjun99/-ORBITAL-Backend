const { home } = require('./API/home');
const { item } = require('./API/item');
const { getUserListing } = require('./API/history');
const { marketplace } = require('./API/marketplace');
const { getHomepageListing } = require('./Cloud Functions/Home/getHomepageListings');

/// HTTP Requests for Marcus
exports.home = home;
exports.item = item;
exports.getUserListing = getUserListing;
exports.marketplace = marketplace;
exports.getHomepageListing = getHomepageListing;
