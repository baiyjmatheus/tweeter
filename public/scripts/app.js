// Fake data taken from initial-tweets.json
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


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
        <img class="tweet-profile" src="${tweetObj.user.avatars.small}">
        <h2>${tweetObj.user.name}</h2>
      </div>
      <span>${tweetObj.user.handle}</span>
    </header>
  `;

  var tweetBody = `
    <div class="tweet-body">
      <p>${tweetObj.content.text}</p>
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
    $tweetContainer.append($tweetElem);
  })
}

// Async POST request for new tweet
function postTweet(form) {
  $.post("/tweets", $(form).serialize());
}

$(document).ready(function() {
  renderTweets(data);

  // Post tweet AJAX
  $("section.new-tweet form").on("submit", function(e) {
    e.preventDefault();
    // $.post("/tweets", $(this).serialize());
    postTweet(this);
  });


});