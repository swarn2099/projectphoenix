function loadGamingEvents() {
  db.collection("gameEvents").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          var gameCard = '<div class="col m3 s12"><a onclick="loadGameEventPage(this)" data-eventName="'+doc.data().eventTitle+'"><div class="card z-depth-5" ><div class="card-image"><img src="' + doc.data().background + '"></div><div class="card-content black white-text"><h6 style="font-weight: 900;">' + doc.data().eventTitle + '</h6><h6 style="font-weight: 100;">' + doc.data().dateOfEvent + " from " + doc.data().time + '</h6><h6 style="font-weight: 100;">' + doc.data().venue + '</h6></div></div></a></div>';
          var docRef = db.collection("gameEvent").doc("SF");
          $('#gameEventList').append(gameCard);
      });
  });
}

function loadGameEventPage(d) {
  window.open("gameEvent.html", "_self")
  console.log(d.getAttribute("data-eventName"));
  sessionStorage.setItem("eventDataName", d.getAttribute("data-eventName"));
}
function loadGameEventPageFromHome(d) {
  window.open("www/gameEvent.html", "_self")
  console.log(d.getAttribute("data-eventName"));
  sessionStorage.setItem("eventDataName", d.getAttribute("data-eventName"));
}



function loadEventDetails() {
  var eventName = sessionStorage.getItem("eventDataName");
  var docRef = db.collection("gameEvents").doc(eventName);

  docRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      var background = doc.data().background;
      var title = doc.data().eventTitle;
      var venue = doc.data().venue;
      var date = doc.data().dateOfEvent;
      var time = doc.data().time;
      var twitch = doc.data().twitch;
      var facebook = doc.data().facebook;
      var discord = doc.data().dicsord;
      var spotify = doc.data().spotify;
      var typeform = doc.data().typeform;
      var bracket = doc.data().bracket;
      $('.banner').css('background-image', 'url(' + background + ')');
      $('#welcome').append("Welcome to " + title);
      $('#venue').append(venue);
      $('#bracket').append(bracket);

      $('#dateTime').append(date + " from " + time);
      new Twitch.Embed("twitch-embed", {
        width: 820,
        height: 480,
        channel: twitch
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
}
