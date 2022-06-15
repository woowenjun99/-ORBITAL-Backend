const { connect } = require('mongoose');
const { postHandler, getHandler, putHandler } = require('../handler/user');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

exports.user = functions
	.region('asia-southeast1')
	.https.onRequest((req, res) => {
		cors(req, res, async () => {
			let result;

			// Modularise my code so that it is testable
			try {
				connect(process.env.DB_URL);
				switch (req.method) {
					case 'POST':
						result = await postHandler(req);
						break;

					case 'GET':
						result = await getHandler(req);
						break;

					case 'PUT':
						result = await putHandler(req);
						break;

					default:
						return res.status(403).json({ error: 'No such route' });
				}

				const { status, message } = result;
				return res.status(status).json({ message: message });
			} catch (e) {
				return res.status(500).json({ message: e.message });
			}
		});
	});
