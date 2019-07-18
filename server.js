const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

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
		res.json("logged in");
	} else {
		res.status(400).json("error logging in");
	}
});

app.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	database.users.push({
		id: "125",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});

app.listen(3000, () => {
	console.log("App running on port 3000");
});
