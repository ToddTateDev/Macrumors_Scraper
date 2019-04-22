//GETTING ALL THE NPM PACKAGES AS WELL AS SETTING MODELS AND PORT#
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
// Initialize Express
var app = express();

// Configure middleware


app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/macrumorsdb", { useNewUrlParser: true });



app.get("/scrape", function(req, res) {
    axios.get("http://www.macrumors.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $("")
    })
})
//ROUTES




// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

