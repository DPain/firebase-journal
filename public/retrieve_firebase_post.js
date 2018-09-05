/**
 * retrieve_firebase_post.js
 */

var last_post_index = 0;

var LIMIT = 12;
var grid = document.getElementById('posts');
var nav_buttons = document.getElementById('nav-buttons');

function fill_in_posts(start, num) {
  var i = start;
  firebase.database().ref('post_count').once('value').then(function(snapshot) {
    var post_count = snapshot.val();
    for (i = start; i < post_count && i < (start + num); i++) {
      firebase.database().ref('posts/' + String(i)).once('value').then(function(entry) {
        var div_title = document.createElement('div');
        div_title.className = 'mdl-card__title';
        var h4_title = document.createElement('h4');
        div_title.appendChild(h4_title);
        var div_body = document.createElement('div');
        div_body.className = 'mdl-card__supporting-text card-body';
        var p_body = document.createElement('p');
        div_body.appendChild(p_body);
        var div_date = document.createElement('div');
        div_date.className = 'mdl-card__supporting-text'
        var p_date = document.createElement('p');
        div_date.appendChild(p_date);
        var div_post = document.createElement('div');
        div_post.className = 'mdl-card mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone responsive';
        
        if(entry.val().title == null) {
          h4_title.appendChild(document.createTextNode(''));
        } else {
          h4_title.appendChild(document.createTextNode(entry.val().title));
        }
        if(entry.val().body == null) {
          p_body.appendChild(document.createTextNode(''));
        } else {
          p_body.appendChild(document.createTextNode(entry.val().body));
        }

        var date = new Date(entry.val().date);
        div_date.appendChild(document.createTextNode(date.toString()));

        div_post.appendChild(div_title);
        div_post.appendChild(div_body);
        div_post.appendChild(div_date);
        
        grid.insertBefore(div_post, grid.firstChild);
        
        last_post_index = Number(entry.key);
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function(event) {
  firebase.database().ref('post_count').once('value').then(function(snapshot) {
    var post_count = snapshot.val();
    console.log(post_count - LIMIT);
    fill_in_posts(post_count - LIMIT, LIMIT);
  });
});

function bring_older() {
  firebase.database().ref('post_count').once('value').then(function(snapshot) {
    var len;
    if(last_post_index + 1 >= 2 * LIMIT) {
      len = LIMIT;
    } else {
      len = snapshot.val() % LIMIT;
    }

    if (last_post_index >= LIMIT && Number(snapshot.val()) >= last_post_index - LIMIT - len + 1) {
      console.log('Retrieving older posts...');
      grid.innerHTML = '';
      
      fill_in_posts(last_post_index - LIMIT - len + 1, len);
    } else {
      console.log('No more older posts...');
    }
  });
}

function bring_newer() {
  firebase.database().ref('post_count').once('value').then(function(snapshot) {
    if (snapshot.val() > last_post_index + 1) {
      console.log('Retrieving newer posts...');
      grid.innerHTML = '';
      fill_in_posts(last_post_index + 1, LIMIT);
    } else {
      console.log('No more newer posts...');
    }
  });
}

document.getElementById('previous_btn').addEventListener('click', function() {
  bring_newer();
});
document.getElementById('next_btn').addEventListener('click', function() {
  bring_older();
});