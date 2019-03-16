// general requires
const API = require("./API-auth");
const request = require("request");
const querystring = require("querystring");

// express setup
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// stores current selection
let currentSelection = {};

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// home route
app.get("/", (req, res) => {
    res.render("index");
});

// search route
app.get("/search", (req, res) => {
    res.render("search", {"error": false});
});

// show route
app.get("/show", (req, res) => {
    res.render("show");
});

// about route
app.get("/about", (req, res) => {
    res.render("about");
});

// view route
app.get("/view/:id", (req, res) => {
    let recipe = {};

    currentSelection.forEach(hit => {
        // find recipe from list
        if (hit.recipe.uri.split("#")[1] === req.params.id)
        {
            recipe = hit.recipe;
            return true;
        }
    });

    res.render("view", {recipe: recipe});
});

// show POST route
app.post("/show", (req, res) => {
    let data = parseBody(req.body.fields);
    data.q = data.q.split(",");
    
    let url = `https://api.edamam.com/search?${querystring.stringify(data)}&from=0&to=12`;

    request.get(url, (error, response, body) => {
        if (error || response.statusCode !== 200)
        {
            return res.render("search", {"error": true});
        }
        else
        {
            let data = JSON.parse(response.body);

            // store response for future use
            currentSelection = data.hits;

            res.render("show", {"count": data.count,"recipes": data.hits});
        }
    });
});

app.listen(port, () => console.log("Server started"));

function parseQueryText(queryText)
{
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