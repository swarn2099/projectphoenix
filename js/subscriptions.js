$(document).ready(function() {
  $('#signupSection').hide();
  $('#loginButton').show();
  $('#signoutButton').hide();


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      $('#loginButton').hide();
      $('#signoutButton').show();

      // console.log(user.email);
      var docRef = db.collection("users").doc(user.email);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          var subscriptionsArr = doc.data().gamerSubs;
          // console.log("Subscriptions: ", subscriptionsArr);
          for (var i = 0; i < subscriptionsArr.length; i++) {
            // console.log(subscriptionsArr[i]);
            var gamerRef = db.collection("gamers").doc(subscriptionsArr[i]);
            gamerRef.get().then(function(doc) {
              if (doc.exists) {
                $('#alreadySignedin').hide();
                $('#alreadySignedinHome').hide();

                // console.log("Document data:", doc.data());
                $().hide();
                var gamerSubCard = '<div class="col s3"><a onclick="openPlayerPagefromHome(this)" data-playerName="' + doc.data().twitch + '"<div class="card horizontal black z-depth-5"><div class="card-image"><img src="' + doc.data().gameImage + '" style="border-radius: 20px 0px 0px 20px; height: 100px;"></div><div class="card-content"><h5 class="center-align white-text"style="font-weight: 900;">' + doc.data().twitch + '</h5></div></div></a></div>';
                $('#yourSubs').append(gamerSubCard);
                $('#yourSubsHome').append(gamerSubCard);

              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });

    }
  });
});

function addSubscription(d) {
  var toSubscribe = d.getAttribute("data-playerName");

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // console.log(toSubscribe, "=>", user.email);
    // User is signed in.
    var washingtonRef = db.collection("users").doc(user.email);

    // Atomically add a new region to the "regions" array field.
    washingtonRef.update({
      gamerSubs: firebase.firestore.FieldValue.arrayUnion(toSubscribe)
    });
    M.toast({
      html: 'Added to communities :)',
      classes: 'rounded black white-text'
    });
  } else {
    // No user is signed in.
  }
});

}
function hideLogin() {
  $('#loginSection').hide();
  $('#signupSection').show();
}

function hideSignup() {
  $('#loginSection').show();
  $('#signupSection').hide();
}

function login() {
  var email = document.getElementById("emailLogin").value;
  var password = document.getElementById('passwordLogin').value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    $('.modal').modal('close');

    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message
    M.toast({
      html: 'Incorrect Email or Password',
      classes: 'rounded red white-text'
    });
  });
};
function createUser() {
  var first = document.getElementById("firstSignup").value;
  var last = document.getElementById("lastSignup").value;
  var email = document.getElementById("emailSignup").value;
  var password = document.getElementById('passwordSignup').value;
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
    db.collection("users").doc(email).set({
        first: first,
        last: last,
        email: email,
        password: password,
        university: "utd",
        gamerSubs: [],
        entSubs: [],
        musicSubs: []
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

  }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

};

function signout() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location.href = "../index.html";

  }, function(error) {
    window.location.href = "../index.html";
  });
}
function signoutHome() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location.href = "index.html";

  }, function(error) {
    window.location.href = "../index.html";
  });
}
