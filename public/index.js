$.getJSON("/articles", function (data) {

    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div data-id='" + data[i]._id + "' class='card'>" +
            "<div class='card-header'>" +
            "<h3><a class='article-link' target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a>   "
            + "   <a class='btn btn-success save'>Save Article</a>"
            + "</h3>" + "</div>" +
            "<div class='card-body'>" + data[i].body + "</div>" +
            "</div>"
        )
    }
});





$(document).on("click", "a.clear", function () {
    $("#articles").empty();//might not need

    //clear the database with ajax call

    $.ajax({
        method: "GET",
        url: "/remove/"//the url on the backend that clears 
    }).then(function(removed) {
        location.reload();
    })

});


$(document).on("click", "a.scrape-new", function () {

    
    $.ajax({
        method: "GET",
        url: "/scrape/"//the url on the backend that gets new articles
    }).then(function(newArticles) {
        for (var i = 0; i < newArticles.length; i++) {
            $("#articles").append("<div data-id='" + newArticles[i]._id + "' class='card'>" +
                "<div class='card-header'>" +
                "<h3><a class='article-link' target='_blank' rel='noopener noreferrer' href='" + newArticles[i].link + "'>" + newArticles[i].title + "</a>"
                + "<a class='btn btn-success save'>Save Article</a>"
                + "</h3>" + "</div>" +
                "<div class='card-body'>" + newArticles[i].body + "</div>" +
                "</div>"
            )
        }
        location.reload();
    })
});

$(document).on("click", "a.save", function () {
    //change the boolean in the DB to saved with an ajax call??
    
    var thisId = $(this).closest("div.card").attr("data-id");
    $.ajax({
        method: "POST",
        url: "/savearticle/" + thisId//the url on the backend that looks at ids
    }).then(function(nowSaved) {
        res.json(nowSaved);

    })
});




