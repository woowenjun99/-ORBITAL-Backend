require('dotenv').config();
const { connect } = require('mongoose');

exports.connectDatabase = () => {
  connect(process.env.DB_URL);
};
