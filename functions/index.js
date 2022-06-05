require("dotenv").config();
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const { connect, Schema, model } = require("mongoose");
const { userSchema } = require("./service/Schema");

exports.addUser = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors(req, res, async () => {
      switch (req.method) {
        case "POST":
          try {
            // Connect to MongoDB
            await connect(process.env.DB_URL);

            // Retrieve the relevant information from the database
            const { username, name, phone, postal, address, gender, dob, uid } =
              req.body;

            // Create a new database model
            const User = model("users", userSchema);

            const user = new User({
              name: name,
              username: username,
              phone: phone,
              postal: postal,
              address: address,
              gender: gender,
              dob: dob,
              firebaseUID: uid,
            });

            // Saving the user information
            await user.save();
            return res.status(200).json({ message: user });
          } catch (e) {
            return res.status(500).json({ e });
          }

        default:
          return res.status(403).json({ error: "No such route" });
      }
    });
  });

exports.saveUser = async function saveUser() {};
