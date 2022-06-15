const { user } = require('./API/user');
const { home } = require('./API/home');
const { item } = require('./API/item');
const { history } = require('./API/history');

/// HTTP Requests for Marcus
exports.user = user;
exports.home = home;
exports.item = item;
exports.history = history;
