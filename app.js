// general requires
const API = require("./API-auth");
const request = require("request");
const querystring = require("querystring");

// express setup
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

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
    let data = parseBody(req.body.fields);
    data.q = data.q.split(",");
    
    let url = `https://api.edamam.com/search?${querystring.stringify(data)}`;
    console.log(url);

    request.get(url, (error, response, body) => {
        if (error)
        {
            return res.redirect("/");
        }
        console.log(response.statusCode);
        res.redirect("/show");
    });

    //console.log(url);

    //res.redirect("/show");
});

app.listen(port, () => console.log("Server started"));

function parseQueryText(queryText)
{
    console.log(queryText);
    let query = "";
    let ingredients = queryText.split(",");

    ingredients.forEach(ingredient => {
        query += "q=" + ingredient + "&";
    });

    return query;
}

function parseHealth(healthLabels)
{
    let health = '';

    healthLabels.forEach(label => {
        health += "health=" + label + "&";
    });

    return health;
}

function parseBody(body)
{
    console.log(body);
    // parse body
    let queryText = body.ingredientInput;

    let obj = {};
    
    obj.q = queryText;
    obj.app_id = API.appID;
    obj.app_key = API.appKey;

    if (body.diet !== "")
    {
        obj.diet = body.diet;
    }

    if (body.health !== undefined && body.health !== "")
    {
        obj.health = body.health;
    }

    let calories = "";

    if (body.minCal === "" && body.maxCal === "")
    {
        calories = "";
    }
    else if (body.minCal !== "" && body.maxCal === "")
    {
        calories = body.minCal + "+";
        obj.calories = calories;
    }
    else if (body.minCal === "" && body.maxCal !== "")
    {
        calories = body.maxCal;
        obj.calories = calories;
    }
    else
    {
        calories = body.minCal + "-" + body.maxCal;
        obj.calories = calories;
    }

    let time = "";

    if (body.minTime === "" && body.maxTime === "")
    {
        time = "";
    }
    else if (body.minTime !== "" && body.maxTime === "")
    {
        time += body.minTime + "+";
        obj.time = time;
    }
    else if (body.minTime === "" && body.maxTime !== "")
    {
        time += body.maxTime;
        obj.time = time;
    }
    else
    {
        time = body.minTime + "-" + body.maxTime;
        obj.time = time;
    }
    
    return obj;
}