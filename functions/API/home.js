require('dotenv').config();
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { connect } = require('mongoose');
const { getHandler } = require('../handler/home');

exports.home = functions
	.region('asia-southeast1')
	.https.onRequest((req, res) => {
		cors(req, res, async () => {
			try {
				let result;
				connect(process.env.DB_URL);
				switch (req.method) {
					case 'GET':
						result = await getHandler(req);
						break;

					default:
						return res.status(405).json({ message: 'No such method' });
				}

				const { status, message } = result;
				return res.status(status).json({ message: message });
			} catch (e) {
				return res.status(500).json({ message: e.message });
			}
		});
	});
