$(document).ready(function() {
  $("section.new-tweet form textarea").keyup(function() {
    // calculate characters counter
    var charLength = $(this).val().length;
    var counter = 140 - charLength;
    $(this).siblings("span.counter").text(counter);
    // Negative value
    if (counter < 0) {
      $(this).siblings("span.counter").addClass("negative");
    } else {
      $(this).siblings("span.counter").removeClass("negative");
    }
  });
});