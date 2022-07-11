require("dotenv").config();
const functions = require("firebase-functions");
const { connect, connection, model } = require("mongoose");
const cors = require("cors")({ origin: true });
const { userSchema, itemSchema } = require("../service/Schema");