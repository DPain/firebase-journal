/**
 * firebase_login_post.js
 */

// Check if user is already logged in for Login button text.
firebase.auth().onAuthStateChanged(function(user) {
 if (user) {
  console.log('Already logged in');
  document.getElementById('login_btn').innerText = 'Logout';
  document.getElementById('post_btn').style.visibility = 'visible';
 } else {
  console.log('Not logged in');
  document.getElementById('login_btn').innerText = 'Login';
  document.getElementById('post_btn').style.visibility = 'hidden';
 }
});

// Create elements for post dialog.
var dialog = document.createElement('dialog');
dialog.className = 'mdl-dialog';
var h4_dialog = document.createElement('h4');
h4_dialog.appendChild(document.createTextNode('Post'));
var label_title = document.createElement('label');
label_title.className = 'mdl-textfield__label';
label_title.htmlFor = 'title';
label_title.appendChild(document.createTextNode('Title: '));
var label_body = document.createElement('label');
label_body.className = 'mdl-textfield__label';
label_body.htmlFor = 'body';
label_body.appendChild(document.createTextNode('Body: '));
var input_title = document.createElement('input');
input_title.id = 'title';
input_title.className = 'mdl-textfield__input';
input_title.type = 'text';
var textarea_body = document.createElement('textarea');
textarea_body.id = 'body';
textarea_body.className = 'mdl-textfield__input';
textarea_body.type = 'text';
var div_title = document.createElement('div');
div_title.className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';
var div_body = document.createElement('div');
div_body.className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';

var btn_close = document.createElement('button');
btn_close.className = 'mdl-button mdl-js-button mdl-js-ripple-effect close';
btn_close.type = 'button';
btn_close.appendChild(document.createTextNode('Close'));
btn_close.addEventListener('click', function() {
 console.log('Closing Dialog...');
 dialog.close();
});
var btn_submit = document.createElement('button');
btn_submit.className = 'mdl-button mdl-js-button mdl-js-ripple-effect';
btn_submit.type = 'button';
btn_submit.appendChild(document.createTextNode('Post'));


var div_actions = document.createElement('div');
div_actions.className = 'mdl-dialog__actions';

dialog.appendChild(h4_dialog);
div_title.appendChild(label_title);
div_title.appendChild(input_title);
dialog.appendChild(div_title);
dialog.appendChild(div_title);
div_body.appendChild(label_body);
div_body.appendChild(textarea_body);
dialog.appendChild(div_body);
dialog.appendChild(div_body);
div_actions.appendChild(btn_submit);
div_actions.appendChild(btn_close);
dialog.appendChild(div_actions);
dialog.appendChild(div_actions);
document.getElementsByTagName('body')[0].appendChild(dialog);

if (!dialog.showModal) {
 dialogPolyfill.registerDialog(dialog);
}

var login_btn = document.getElementById('login_btn');
login_btn.addEventListener('click', function() {
 var user = firebase.auth().currentUser;

 if (user) {
  console.log(user);
  console.log('Logging out...');

  firebase.auth().signOut().then(function() {
   console.log('Logged out!');
   document.getElementById('login_btn').innerText = 'Login';
   document.getElementById('post_btn').style.visibility = 'hidden';
  }).catch(function(error) {
   // An error happened.
  });


 } else {
  console.log('Opening Login Popup...');

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a Google Access Token.
   var token = result.credential.accessToken;
   // The signed-in user info.
   var user = result.user;

   console.log('Logged in!');
   document.getElementById('login_btn').innerText = 'Logout';
   document.getElementById('post_btn').style.visibility = 'visible';
  });
 }
});

function send_post() {
 console.log('Sending post...');

 var db = firebase.database();
 db.ref("/.info/serverTimeOffset").on('value', function(offset) {
  var offset = offset.val() || 0;
  var serverTime = Date.now() + offset;

  var ref = db.ref("post_count");
  ref.transaction(function(cnt) {
   if (cnt != null) {
    // Updates post count
    db.ref('posts/' + String(cnt)).set({
     title: document.getElementById('title').value,
     body: document.getElementById('body').value,
     date: serverTime
    });

    dialog.close();
    return cnt + 1;
   } else {
    return cnt
   }
  });
 });
}

function post() {
 dialog.showModal();
}

post_btn.addEventListener('click', function() {
 post()
});
btn_submit.addEventListener('click', function() {
 send_post()
});