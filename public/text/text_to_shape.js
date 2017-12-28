console.log("loaded");

$( document ).ready(function() {
    $("#svg-action").click(function(e) {
      e.preventDefault();
      const data = {data: $("#svg-text").val()};
      getPath(data);
    });
});

function getPath(data) {
  $.ajax({
    url: 'http://localHost:8000/api/svg/',
    method: 'GET',
    data: data,
    dataType: 'json'
    }).done(function(data) {
      setPath(data);
    }).fail(function(xhr, textStatus, errorThrown) {
      console.log(errorThrown);
    });
}

function setPath(text) {
  const container = $("#svg-container");
  container.empty();
  container.append($.parseHTML(text))
}
