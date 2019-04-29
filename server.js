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


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/macrumorsdb", { useNewUrlParser: true });

app.get("/", function (req, res) {
    res.render("home");
})


app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

app.get("/saved", function (req, res) {
    db.Article.find({ saved: true })
        .then(function (savedArticles) {

            console.log(savedArticles);
            res.json(savedArticles)
        }).catch(function (err) {
            res.json(err);
        })
})


app.get("/scrape", function (req, res) {
    axios.get("http://www.macrumors.com").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.article").each(function (i, element) {

            var title = $(element).find("h2.title").text();
            var urlLink = $(element).find("h2.title").find("a").attr("href");
            var article = $(element).find("div.content_inner").text();

            db.Article.create({ "title": title, "link": urlLink, "body": article }).then(function (newArticles) {
                // res.render("home");
                res.json(newArticles)
            }).catch(function (err) {
                throw err;
            })
        })

    })


})

app.get("/allsaved", function (req, res) {
    //query the database to get all articles with the boolean "Saved"
    db.Article.find({ saved: true })
        .then(function (savedArticles) {
            res.json(savedArticles);
        }).catch(function (err) {
            res.json(err);
        })
})



app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/savecomment/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment.id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/savearticle/:id", function (req, res) {
    db.Article.findOneAndUpdate({
        _id: req.params.id,

    }, { $set: { saved: true } })
        .then(function (savedTrue) {
            res.json(savedTrue)
        });
});

app.post("/removearticle/:id", function (req, res) {
    db.Article.findByIdAndUpdate({
        _id: req.params.id,

    }, { $set: { saved: false } })
        .then(function (savedFalse) {
            res.json(savedFalse)
        });
});

app.get("/remove", function (req, res) {
    //deletes everything from the database
    db.Article.deleteMany({}).then(function (allDeleted) {
        // location.reload();

    });
})



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


