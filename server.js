const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

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

const database = {
	users: [
		{
			id: "123",
			name: "john",
			email: "john@gmail.com",
			password: "pass",
			entries: 0,
			joined: new Date()
		},
		{
			id: "124",
			name: "sally",
			email: "sally@gmail.com",
			password: "pass2",
			entries: 0,
			joined: new Date()
		}
	]
};

app.get("/", (req, res) => {
	res.send(database.users);
});

app.post("/login", (req, res) => {
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json("Error logging in");
	}
});

// the user's registration data is received from the body, password is hashed and the new user is stored within the DB
app.post("/register", (req, res) => {
	const saltRounds = 10;
	const { name, email, password } = req.body;
	bcrypt.hash(password, saltRounds, function (err, hash) {});
	db("users")
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(console.log);
	res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			res.json(user);
		}
	});
	if (!found) {
		res.status(400).json("not found");
	}
});

app.put("/image", (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json("not found");
	}
});

app.listen(3000, () => {
	console.log("App running on port 3000");
});
