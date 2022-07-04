require('dotenv').config();
const functions = require('firebase-functions');
const { connect, connection, model } = require('mongoose');
const cors = require('cors')({ origin: true });
const { transactionSchema, itemSchema } = require('../service/Schema');

exports.return_item = functions
  .region('asia-southeast1')
  .https.onRequest(async (req, res) => {
    /// Block all request but 'PUT'
    if (req.method !== 'PUT') {
      res.status(405).json({ message: 'Method not allowed' });
    }

    if (!connection.readyState) {
      connect(process.env.DB_URL);
    }

    const { item_id, uid } = req.body;
    const Item = new model('items', itemSchema);
    const Transaction = new model('transactions', transactionSchema);
    const session = await connection.startSession();
    const foundItem = await Item.findById(item_id, null, { session });
    if (!foundItem) {
      return res.status(404).json({ message: 'No item found' });
    }
  });
