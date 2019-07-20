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

console.log(db.select("*").from("users"));

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send(database.users);
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

app.listen(process.event.PORT || 3000, () => {
	console.log(`App running on port ${process.env.PORT}`);
});
