var numPlayers = 0;
var teamCounter = 0;

console.log("%c Project Phoenix's Apex Engine...all systems go!", 'color: red; font-size: 12px; font-weight: 900; font-family: Arial;');
db.collection("apexLobby").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(lobby) {
    var platform;
    numPlayers +=1;
    // doc.data() is never undefined for query doc snapshots
    console.log("%c Entering the lobby...", 'color: blue; font-size: 10px; font-weight: 900; font-family: Arial;');
    console.log(lobby.id, " => ", lobby.data());
    if(lobby.data().platform == 'XBOX'){
      platform = 1;
    }else if(lobby.data().platform == "PS4"){
      platform = 2;
    }else{
      platform = 5;
    }

    if(lobby.data().addedToTeam == "false"){
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://cors-anywhere.herokuapp.com/https://public-api.tracker.gg/apex/v1/standard/profile/' + platform + '/' + lobby.data().name,
        "method": "GET",
        "headers": {
          "TRN-Api-Key": "1a753f25-4dce-4936-8092-554a2b44b927",
          "cache-control": "no-cache",
          "Postman-Token": "4c031e3e-695e-47de-b078-6c71a76badf2"
        }
      };
      $.ajax(settings).done(function(apex) {
        console.log("Lobby Player: ", apex);
        if (apex.data.stats.find(o => o.metadata.key === 'Damage')) {
          console.log("Found Damage");
          var addPlayer = {
            name: lobby.data().name,
            difference: 0,
            overallDamage: 0,
            platform: platform,
            twitch: lobby.data().twitch,
          }
          db.collection('apex').doc(lobby.data().teamName).update({
            players: firebase.firestore.FieldValue.arrayUnion(addPlayer)
          });
          db.collection('apexLobby').doc(lobby.id).update({
            addedToTeam: true
          });
        }
      });
    }
    console.log("Number of Players: ", numPlayers);
    $( "#lobbyPlayers" ).replaceWith('<h3 class="white-text center-align" id="lobbyPlayers">'+numPlayers+' Players</h3>');

  });
});
console.log("Number of Players: ", numPlayers);

db.collection('tournaments').doc('apexarena').get().then(function(date) {

  // Set the date we're counting down to
  var countDownDate = new Date(date.data().timer).getTime();
  // Update the count down every 1 second
  var x = setInterval(function() {
    // Get todays date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = hours + "h " +
      minutes + "m " + seconds + "s ";
    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("countdown").innerHTML = "EXPIRED";
    }
  }, 1000);





  if (date.data().start == moment().format("MMM Do")) {
    console.log("Date Matches ... lesgo");
    db.collection("apex").get().then(function(querySnapshot) {
      console.log("%c Starting Phoenix Engine...", 'color: teal; font-size: 10px; font-weight: 900; font-family: Arial;');
      querySnapshot.forEach(function(team) {
        // console.log(team.id, "=>", team.data());
        teamCounter += 1;
        var tempArr = [];
        var initArr = [];
        if (team.data().players.length = 3) {
          team.data().players.forEach(function(player) {
            // console.log(player);idk if this is working
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": 'https://cors-anywhere.herokuapp.com/https://public-api.tracker.gg/apex/v1/standard/profile/' + player.platform + '/' + player.name,
              "method": "GET",
              "headers": {
                "TRN-Api-Key": "1a753f25-4dce-4936-8092-554a2b44b927",
                "cache-control": "no-cache",
                "Postman-Token": "4c031e3e-695e-47de-b078-6c71a76badf2"
              }
            };
            $.ajax(settings).done(function(apex) {
              // console.log(apex.data.metadata.platformUserHandle, "=>", apex.data);
              var damage = apex.data.stats.find(o => o.metadata.key === 'Damage');
              if (team.data().initialized == false) {
                console.log("running inital load");
                player.overallDamage = damage.value;
                initArr.push(player);
                if (initArr.length == 3) {
                  db.collection("apex").doc(team.id).update({
                      "players": initArr,
                      initialized: true
                    })
                    .then(function() {
                      console.log("Init successfully updated!");
                    });
                }
              } else {
                console.log("Running checking system");
                var difference = (damage.value - player.overallDamage);
                if (difference > player.difference) {
                  // console.log("Difference Found...updating player values");
                  player.difference = difference;
                  var feedObj = {
                    name: player.name,
                    difference: difference,
                    time: moment().format('h:mm a'),
                    img: team.data().banner
                  };
                  db.collection('tournaments').doc('apexarena').update({
                    feed: firebase.firestore.FieldValue.arrayUnion(feedObj)
                  });
                }
                player.overallDamage = damage.value;
                tempArr.push(player);
                console.log(team.id, "Temp Array is: ", tempArr);
                if (tempArr.length == 3) {
                  db.collection("apex").doc(team.id).update({
                      "players": tempArr
                    })
                    .then(function() {
                      console.log("Difference was found and successfully updated!");
                    });
                }
              }
            });
            console.log("Num of teams: ", teamCounter);
            // $( "#arenaTeams" ).replaceWith('<h3 class="white-text center-align" id="lobbyPlayers">'+teamCounter+' Teams</h3>');
          });
        }
      });
      $( "#arenaTeams" ).replaceWith('<h3 class="white-text center-align" id="lobbyPlayers">'+teamCounter+' Teams</h3>');

    })
  }
  db.collection("apex").orderBy("damageTotal", "desc").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {

      var teamDamage = doc.data().players[0].difference + doc.data().players[1].difference + doc.data().players[2].difference;

      var teamCard = '<div class="card horizontal transparent z-depth-5 hoverable" style="height: 150px;"><div class="card-image"><img style="border-radius: 15px 0px 0px 15px; height: 150px; width: 200px;" src="' + doc.data().banner + '"></div><div class="card-stacked"><div class="card-content grey darken-4" style="border-radius: 0px 15px 15px 0px; padding: 10px; padding-top: 0px; padding-bottom: 0px;"><div class="row container"><div class="col m6 push-m1"><h5 class="white-text left-align"> Team ' + doc.data().teamName + ' </h5></div><div class="col m6 push-m5"><h4 class="white-text right-align"> ' + teamDamage + ' PTS</h4></div></div><div class="row" style="margin-top: -1%;"><div class="col m4 hoverable"><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[0].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[0].name + '</p></div><div class="col m4 hoverable "><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[1].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[1].name + '</p></div><div class="col m4 hoverable"><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[2].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[2].name + '</p></div></div></div></div></div>';
      $('#teamSection').append(teamCard);
      $('.progress').hide();

      db.collection("apex").doc(doc.id).update({
          "damageTotal": teamDamage
        })
        .then(function() {
          // console.log("Document successfully updated!");
        });
    });
  });
});
