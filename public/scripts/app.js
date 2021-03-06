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

  // Time calculation
  var difference = Math.floor(Date.now() - tweetObj.created_at);
  var timeMsg = 0;
  // var time = Math.floor(Date.now() - tweetObj.created_at);
  if ((difference / 1000) < 60) {
    timeMsg = Math.round(difference/1000) + " seconds ago";
  } else if (difference / (1000*60) < 60) {
    timeMsg = Math.round(difference / (1000*60)) + " minutes ago";
  } else if (difference / (1000*60*60) < 24) {
    timeMsg = Math.round(difference / (1000*60*60)) +" hours ago";
  } else {
    timeMsg = Math.round(difference / (1000*60*60*24)) + " days ago";
  }

  var likedClass = "";
  if (tweetObj.liked) {
    likedClass = "liked"
  }

  var footer = `
    <footer>
      <p>${timeMsg}</p>
      <ul class="icons">
        <li><i class="fas fa-flag"></i></li>
        <li><i class="fas fa-retweet"></i></li>
        <li><i id="like" class="${likedClass} fas fa-heart"></i></li>
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
    $tweetElem.data("data-id", tweet._id);
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
  $("section.new-tweet span.counter").text("140");
}

// Load tweet(s) from database and render to tweet container
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

function likeTweet(tweetId) {
  $.ajax({
    url: `/tweets/${tweetId}/like`,
    type: "PUT"
  });
}

function unlikeTweet(tweetId) {
  $.ajax({
    url: `/tweets/${tweetId}/unlike`,
    type: "PUT"
  });
}

// XSS escape
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  // Initial tweets in feed
  loadTweets();

  // show or hide new-tweet form - on click listener
  $("button.btn-compose").on("click", function() {
    var newTweet = $("section.new-tweet");
    var errorContainer = $("div#error-container");
    if (newTweet.css("display") === "none") {
      newTweet.slideDown();
      $("section.new-tweet textarea").focus();
    } else {
      newTweet.slideUp();
    }
    // Close error container if its open
    if (errorContainer.css("display") !== "none") {
      errorContainer.slideUp();
    }
  });

  // Post tweet AJAX - form submit listener
  $("section.new-tweet form").on("submit", function(e) {
    // Prevent form default action
    e.preventDefault();
    var errorContainer = $("div#error-container");
    var errorMessage = $("p.error-message");
    var charLength = $("section.new-tweet textarea").val().length;
    // Checks for tweet content validation and displays if there's an error
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
    $("section.new-tweet textarea").focus();
  });

  // Like tweet event listener
  $("section#tweet-container").on("click",  "article.tweet i#like", function(e) {
    var $likeBtn = $(this);
    var $tweet = $likeBtn.closest("article.tweet");
    var tweetId = $tweet.data("data-id");
    if ($likeBtn.hasClass("liked")) {
      // AJAX PUT request to /tweets/:id/unlike
      unlikeTweet(tweetId);
    } else {
      // AJAX PUT request to /tweets/:id/like
      likeTweet(tweetId);
    }
    // Change btn color
    $likeBtn.toggleClass("liked");
  });
});