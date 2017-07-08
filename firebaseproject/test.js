(function() {
    //var firebase = require("firebase");
// Set the configuration for your app
// TODO: Replace with your project's config object
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAV2AmKaEHQKP2-U7irQkWXBR8Dr3WXuLE",
    authDomain: "munucial.firebaseapp.com",
    databaseURL: "https://munucial.firebaseio.com",
    projectId: "munucial",
    storageBucket: "munucial.appspot.com",
    messagingSenderId: "659819957827"
  };
  firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

const dbRefObject = firebase.database().ref().child('object');

dbRefObject.on('value', snap=> console.log(snap.val()));

//writeUserData(1, "Andrew", "jiganyg@gmail.com", null);
})