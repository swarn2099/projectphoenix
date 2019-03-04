$(document).ready(function() {
  db.collection("apex").orderBy("damageTotal", "desc").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      $('#teamNames').append('<option value="'+doc.data().teamName+'" class="white-text">'+doc.data().teamName+'</option>')
      var teamDamage = doc.data().players[0].difference + doc.data().players[1].difference + doc.data().players[2].difference;

      var teamCard = '<div class="card horizontal transparent z-depth-5 hoverable" style="height: 150px;"><div class="card-image"><img style="border-radius: 15px 0px 0px 15px; height: 150px; width: 200px;" src="' + doc.data().banner + '"></div><div class="card-stacked"><div class="card-content grey darken-4" style="border-radius: 0px 15px 15px 0px; padding: 10px; padding-top: 0px; padding-bottom: 0px;"><div class="row container"><div class="col m6 push-m1"><h5 class="white-text left-align"> Team ' + doc.data().teamName + ' </h5></div><div class="col m6 push-m5"><h4 class="white-text right-align"> ' + teamDamage + ' PTS</h4></div></div><div class="row" style="margin-top: -1%;"><div class="col m4 hoverable"><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[0].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[0].name + '</p></div><div class="col m4 hoverable "><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[1].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[1].name + '</p></div><div class="col m4 hoverable"><p class="white-text center-align" style="font-size: 15px;"> ' + doc.data().players[2].difference + ' PTS</p><p class="white-text center-align" style="font-size: 12px;"> ' + doc.data().players[2].name + '</p></div></div></div></div></div>';
      $('#teamSection').append(teamCard);

      var teamCardMobile = '<div class="card z-depth-3 hoverable"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="'+doc.data().banner+'" style="border-radius: 15px 15px 0px 0px;"><span class="card-title">Team '+doc.data().teamName+'</span></div><div class="card-content center-align"><h4 style="font-weight: 900;">'+teamDamage+' PTS</h4></div><div class="card-reveal"><span class="card-title grey-text text-darken-4">Team '+doc.data().teamName+'<i class="material-icons right">close</i></span><h5 >'+doc.data().players[0].name+' <br><span style="font-weight: 900;">'+doc.data().players[0].difference+'</span></h5><br><h5 >'+doc.data().players[1].name+' <br><span style="font-weight: 900;">'+doc.data().players[1].difference+'</span></h5><br><h5 >'+doc.data().players[2].name+'<br><span style="font-weight: 900;">'+doc.data().players[2].difference+'</span></h5><br></div></div>';
      $('#teamSectionMobile').append(teamCardMobile);

      $('.progress').hide();

      db.collection("apex").doc(doc.id).update({
          "damageTotal": teamDamage
        })
        .then(function() {
          // console.log("Document successfully updated!");
        });
      // Live Now Section
      doc.data().players.forEach(function(player) {
        $.get({
          url: 'https://api.twitch.tv/kraken/streams/' + player.twitch,
          data: {
            client_id: 'urff2tmjj5swnbqlltvic62bwpn96f'
          },
          error: function(response) {
            console.log("IT DIDNT WORK");
          },
          success: function(response) {
            if (response.stream.stream_type == "live") {
              console.log("EVERYTHING IS GUCCI");
              var liveCard = '<section style="background-color: #2E3353; border-radius: 50px;" class="z-depth-5 hoverable"><div class="row"><div class="col m4"><img src="' + response.stream.preview.large + '" alt="" class="circle responsive-img z-depth-5" style="margin-top: 5%; margin-left: 15px; height: 40px; width: 40px;"></div><div class="col m5 pull-m2"><h6 class="white-text" style="margin-top: 10%;">' + player.name + ' went live</h6></div><div class="col m3 pull-m2" style="margin-top: 2%;"><a href="' + response.stream.channel.url + '" class="waves-effect waves-light btn" style="border-radius: 20px; background-color: #171C2F; width: 150px;">Watch Now</a></div></div></section>';
              $('#liveNow').append(liveCard);
            }
          }
        });
      })


    });
  });

// Num of Teams
var teamCounter = 0;
db.collection("apex").get().then(function(querySnapshot) {
  console.log("%c Starting Phoenix Engine...", 'color: teal; font-size: 10px; font-weight: 900; font-family: Arial;');
  querySnapshot.forEach(function(team) {
    // console.log(team.id, "=>", team.data());
    teamCounter += 1;

      });
      $( "#arenaTeams" ).replaceWith('<h3 class="white-text center-align" id="lobbyPlayers">'+teamCounter+' Teams</h3>');

  });


  // Timer
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





  })
  db.collection('tournaments').doc('apexarena').get().then(function(tourney) {
    if (tourney.exists) {
      // console.log("Document data:", tourney.data());
      for (var i = tourney.data().feed.length - 1; i >= 0; i--) {
        var time = tourney.data().feed[i].time;
        // console.log("time => ", time);
        var feedCard = '<section style="border-radius: 50px;" class="z-depth-5 hoverable grey darken-4"><div class="row"><div class="col m4"><img src="' + tourney.data().feed[i].img + '" alt="" class="circle responsive-img z-depth-5" style="margin-top: 5%; margin-left: 15px; height: 40px; width: 40px;"></div><div class="col m5 pull-m2"><h6 class="white-text" style="margin-top: 10%;">' + tourney.data().feed[i].name + ' got ' + tourney.data().feed[i].difference + ' PTS</h6></div><div class="col m3 pull-m1"><p style="margin-top: 8%; font-size: 15px; padding-right: 5%; color: #7482db; padding-top: 10%;">' + time + '</p></div></div></section>';
        // console.log(feedCard);
        $('#trendingCardSection').append(feedCard);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });


});
