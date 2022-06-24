const { model } = require('mongoose');
const { userSchema, transactionSchema, itemSchema } = require('./Schema');

exports.Item = new model('items', itemSchema);
exports.User = new model('users', userSchema);
exports.Transaction = new model('transactions', transactionSchema);
