const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.send("this is working");
});

app.post("/login", (req, res) => {
	res.json("logging in");
});

app.listen(3000, () => {
	console.log("App running on port 3000");
});
