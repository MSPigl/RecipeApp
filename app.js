// general requires
const API = require("./API-auth");
const axios = require("axios");

// express setup
const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

let url = `https://api.edamam.com/search?q=chicken,beef,carrots&app_id=${API.appID}&app_key=${API.appKey}`;

// home route
app.get("/", (req, res) => {
    res.render("index");
});

// search route
app.get("/search", (req, res) => {
    res.render("search");
});

// show route
app.get("/show", (req, res) => {
    res.render("show");
});

// show POST route
app.post("/show", (req, res) => {
    res.redirect("/show");
});

app.listen(port, () => console.log("Server started"));