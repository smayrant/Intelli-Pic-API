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

app.get("/", (req, res) => {
	res.send(database.users);
});

app.post("/login", (req, res) => {
	db
		.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("Unable to retrieve user"));
			} else {
				res.status(400).json("Incorrect credentials");
			}
		})
		.catch(err => res.status(400).json("Incorrect credentials"));
});

// the user's registration data is received from the body, password is hashed and the new user is stored within the DB
app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	const saltRounds = 10;
	const hash = bcrypt.hashSync(password, saltRounds);
	db
		.transaction(trx => {
			trx
				.insert({
					hash: hash,
					email: email
				})
				.into("login")
				.returning("email")
				.then(loginEmail => {
					return trx("users")
						.returning("*")
						.insert({
							email: loginEmail[0],
							name: name,
							joined: new Date()
						})
						.then(user => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch(err => res.status(400).json("Unable to register"));
});

// retrieve a user based on their id stored within the DB
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	db
		.select("*")
		.from("users")
		.where({
			id: id
		})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json("User not found");
			}
		})
		.catch(err => res.status(400).json("Error retrieving user"));
});

app.put("/image", (req, res) => {
	const { id } = req.body;
	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json("Unable to retrieve user entries"));
});

app.listen(3000, () => {
	console.log("App running on port 3000");
});
