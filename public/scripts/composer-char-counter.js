$(document).ready(function() {
  $("section.new-tweet form textarea").keyup(function(e) {
    var charLength = $("section.new-tweet form textarea").val().length;
    var counter = 140 - charLength;
    $("span.counter").text(counter);
  });
});