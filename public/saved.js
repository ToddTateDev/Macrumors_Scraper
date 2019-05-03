$.getJSON("/saved", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        $("#saved-articles").append("<div data-id='" + data[i]._id + "' class='card'>" +
            "<div class='card-header'>" +
            "<h3><a class='article-link' target='_blank' rel='noopener noreferrer' href='" + data[i].link + "'>" + data[i].title + "</a>   "
            + "<a class='btn btn-danger delete'>Delete From Saved</a>    "
            + "   <button type='button' class='btn btn-info' data-toggle='modal' data-target='#commentModal' comments>Article Comments</a>" +
            "</h3>" + "</div>" +
            "<div class='modal fade' id='commentModal' tabindex='-1' role='dialog' aria-labelledby='commentModalCenterTitle' aria-hidden='true'>" +
            "<div class='modal-dialog modal-dialog-centered' role='document'>" +
              "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                  "<h5 class='modal-title' id='exampleModalLongTitle'>Comments</h5>" +
                  "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                    "<span aria-hidden='true'>&times;</span>" +
                  "</button>" +
                "</div>" +
                "<div class='modal-body'>" +
                  data[i].comments +
                "</div>" +
                "<div class='modal-footer'>" +
                  "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
                  "<button type='button' class='btn btn-primary'>Save changes</button>" +
                "</div>" +
              "</div>" +
            "</div>" +
         "</div>" +
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


$(document).on("click", "a.comments", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).closest("div.card").attr("data-id");

  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  