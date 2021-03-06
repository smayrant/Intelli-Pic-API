const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const login = require("./controllers/login");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "sheldrickmayrant",
		password: "",
		database: "face-recognizer"
	}
});

const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.send("App is working");
});

app.post("/login", (req, res) => {
	login.handleLogin(req, res, db, bcrypt);
});

// the user's registration data is received from the body, password is hashed and the new user is stored within the DB
app.post("/register", (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

// retrieve a user based on their id stored within the DB
app.get("/profile/:id", (req, res) => {
	profile.handleGetProfile(req, res, db);
});

app.put("/image", (req, res) => {
	image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
	image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App running on port ${PORT}`);
});
