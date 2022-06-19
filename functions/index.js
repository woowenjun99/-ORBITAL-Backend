const { user } = require('./API/user');
const { home } = require('./API/home');
const { item } = require('./API/item');
const { getUserListing } = require('./API/history');
const { marketplace } = require('./API/marketplace');

/// HTTP Requests for Marcus
exports.user = user;
exports.home = home;
exports.item = item;
exports.getUserListing = getUserListing;
exports.marketplace = marketplace;
