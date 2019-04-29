$.getJSON("/saved", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        $("#saved-articles").append("<div data-id='" + data[i]._id + "' class='card'>" +
            "<div class='card-header'>" +
            "<h3><a class='article-link' target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a>   "
            + "<a class='btn btn-danger delete'>Delete From Saved</a>    "
            + "   <a class='btn btn-info notes'>Article Comments</a>" +
            "</h3>" + "</div>" +
            "<div class='card-body'>" + data[i].body + "</div>" +
            "</div>"
        )
    }
});

$(document).on("click", "a.delete", function () {
    //change the boolean in the DB to saved with an ajax call??
    
    var thisId = $(".card").attr("data-id");
    $.ajax({
        method: "POST",
        url: "/removearticle/" + thisId//the url on the backend that looks at ids
    }).then(function(nowDeleted) {
        res.json(nowDeleted);
    })
    location.reload();
});