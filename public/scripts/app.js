/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//  Returns the DOM structure of a tweet
function createTweetElement(tweetObj) {
  var header = `
    <header>
      <div class="user-info">
        <img class="tweet-profile" src="${escape(tweetObj.user.avatars.small)}">
        <h2>${escape(tweetObj.user.name)}</h2>
      </div>
      <span>${escape(tweetObj.user.handle)}</span>
    </header>
  `;

  var tweetBody = `
    <div class="tweet-body">
      <p>${escape(tweetObj.content.text)}</p>
    </div>
  `;

  var daysAgo = Date.now() - tweetObj.created_at;
  daysAgo = Math.round(daysAgo / (1000*60*60*24));

  var footer = `
    <footer>
      <p><span>${daysAgo}</span> days ago</p>
      <ul class="icons">
        <li><i class="fas fa-flag"></i></li>
        <li><i class="fas fa-retweet"></i></li>
        <li><i class="fas fa-heart"></i></li>
      </ul>
    </footer>
  `;

  var $tweet = $(
    `<article class='tweet'>
      ${header}
      ${tweetBody}
      ${footer}
    </article>`
  );
  
  return $tweet;
}

// Renders all elements of a tweets array
function renderTweets(tweetsArr) {
  var $tweetContainer = $("#tweet-container");
  tweetsArr.forEach(function(tweet) {
    var $tweetElem = createTweetElement(tweet);
    $tweetContainer.prepend($tweetElem);
  })
}

// Async POST request for new tweet
function postTweet(form) {
  $.post("/tweets", $(form).serialize())
  .then(() => {
    loadTweets(true);
  });
  $("section.new-tweet textarea").val("");
}

// Load tweets from database and render to tweet container
// newTweet = Boolean
function loadTweets(isNewTweet) {
  $.get("/tweets", function(tweets) {
    if (isNewTweet) {
      var lastTweet = [tweets[tweets.length - 1]];
      renderTweets(lastTweet);
    } else {
      renderTweets(tweets);
    }
  });
}

// XSS escape
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  loadTweets();

  // show or hide new-tweet form - on click listener
  $("button.btn-compose").on("click", function() {
    $("section.new-tweet").slideToggle();
    $("section.new-tweet textarea").focus();
  });

  // Post tweet AJAX - form submit listener
  $("section.new-tweet form").on("submit", function(e) {
    e.preventDefault();
    var errorContainer = $("div#error-container");
    var errorMessage = $("p.error-message");
    var charLength = $("section.new-tweet textarea").val().length;
    if (!charLength) {
      errorContainer.slideDown();
      errorMessage.text("Don't forget to type your tweet");
    } else if (charLength > 140) {
      errorContainer.slideDown();
      errorMessage.text("Oops! Your tweet is too long (max: 140 characters)");
    } else {
      errorContainer.slideUp();
      postTweet(this);
    }
  });
});