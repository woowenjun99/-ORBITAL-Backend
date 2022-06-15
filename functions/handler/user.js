const { User } = require('../service/Model');

exports.postHandler = async (req) => {
	try {
		// Retrieve the relevant information from the database
		const { firebaseUID } = req.body;

		// Checks if the user already exist. If it does, throw an error
		const foundUser = await User.findOne({ firebaseUID: firebaseUID });
		if (foundUser) {
			return { status: 400, message: 'User already exists' };
		}

		const user = new User({
			firebaseUID: firebaseUID,
		});

		// Saving the user information
		await user.save();

		return { status: 200, message: user };
	} catch (e) {
		return { status: 500, message: e.message };
	}
};

exports.getHandler = async (req) => {
	try {
		const userID = req.query.user;

		// Checks if the request is valid
		if (!userID) {
			return {
				status: 404,
				message: 'You do not have permission to view this page',
			};
		}

		const foundUser = await User.findOne({ firebaseUID: userID });
		if (!foundUser) {
			return { status: 400, message: 'No such user' };
		}
		return { status: 200, message: foundUser };
	} catch (e) {
		return { status: 500, message: e.message };
	}
};

exports.putHandler = async (req) => {
	try {
		const { name, username, postal, phone, firebaseUID, gender, address } =
			req.body;

		// If firebaseUID is not provided, instantly reject the request.
		if (!firebaseUID) {
			return { status: 400, message: 'Invalid request' };
		}

		// If there is no such user in the DB, immediately reject it.
		const filter = { firebaseUID: firebaseUID };
		const update = {
			name: name,
			username: username,
			postal: postal,
			phone: phone,
			gender: gender,
			address: address,
		};

		const foundUser = await User.findOneAndUpdate(filter, update);
		return { status: 200, message: foundUser };
	} catch (e) {
		return { status: 500, message: e.message };
	}
};
