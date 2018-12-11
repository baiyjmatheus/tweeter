/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweetObj) {
  var $header = $(`
    <header>
      <div class="user-info">
        <img class="tweet-profile" src="${tweetObj.user.avatars.small}">
        <h2>${tweetObj.user.name}</h2>
      </div>
      <span>${tweetObj.user.handle}</span>
    </header>
  `);

  var $tweetBody = $(`
    <div class="tweet-body">
      <p>${tweetObj.content.text}</p>
    </div>
  `);

  var daysAgo = Date.now() - tweetObj.created_at;
  daysAgo = Math.round(daysAgo / (1000*60*60*24));

  var $footer = $(`
    <footer>
      <p><span>${daysAgo}</span> days ago</p>
      <ul class="icons">
        <li><i class="fas fa-flag"></i></li>
        <li><i class="fas fa-retweet"></i></li>
        <li><i class="fas fa-heart"></i></li>
      </ul>
    </footer>
  `);

  var $tweet = $(`
  <article class="tweet">
  ${$header}
  ${$tweetBody}
  ${$footer}
  </article>
  `);

  return $tweet;
}