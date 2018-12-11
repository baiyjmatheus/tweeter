$(document).ready(function() {
  $("section.new-tweet form textarea").keyup(function(e) {
    var charLength = $(this).val().length;
    var counter = 140 - charLength;
    $("span.counter").text(counter);
  });
});