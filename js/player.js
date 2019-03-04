function openPlayerPage(d) {
  window.open("player.html", "_self")

  console.log(d.getAttribute("data-playerName"));
  sessionStorage.setItem("playerDataName", d.getAttribute("data-playerName"));
}

function openPlayerPagefromHome(d) {
  window.open("www/player.html", "_self")

  console.log(d.getAttribute("data-playerName"));
  sessionStorage.setItem("playerDataName", d.getAttribute("data-playerName"));
}
v

function loadPlayer() {

  var playerName = sessionStorage.getItem("playerDataName");
  console.log("SESSION PLAYER NAME IS: ", playerName);
  var docRef = db.collection("gamers").doc(playerName);

  docRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      $.get({
        url: 'https://api.twitch.tv/kraken/users?login='+ doc.data().twitch,
        data: {
          client_id: 'urff2tmjj5swnbqlltvic62bwpn96f'
        },
        error: function(response) {
          console.log("IT DIDNT WORK", response);
        },
        success: function(response) {
          console.log("response", response);
        }
      });
      //twitch
      new Twitch.Embed("twitch-embed", {
        width: 450,
        height: 275,
        channel: doc.data().twitch,
        layout: 'video'
      });

    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

}



function commentThreadHome() {

  var commentContent = document.getElementById('commentHome');
  console.log(commentContent.value);
  db.collection("gamers").doc("marcoflores").update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        name: "Bro",
        content: commentContent.value
      })
    })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}
