//GETTING ALL THE NPM PACKAGES AS WELL AS SETTING MODELS AND PORT#
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3001;
// Initialize Express
var app = express();
var exphbs = require("express-handlebars");

// Configure middleware


app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/macrumorsdb", { useNewUrlParser: true });

app.get("/", function(req, res) {
    res.render("home");
})

app.get("/scrape", function(req, res) {
    axios.get("http://www.macrumors.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $("div.article").each(function(i, element) {

            var title = $(element).find("h2.title").text();
            var urlLink = $(element).find("h2.title").find("a").attr("href");
            var article = $(element).find("div.content_inner").text();

        db.Article.create({ "title": title, "link": urlLink, "body": article})
    })
})
//ROUTES
})



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });



 // Get data to display on the mian page
 //Articals is equal to data and res.render.