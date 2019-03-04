var dateGod;
var participants = 0;


function loadFortnite() {




  // This section is to populate the page with Fortnite Information
  var docRef = db.collection("tournaments").doc('fortnitefrenzy');
  docRef.get().then(function(doc) {
    if (doc.exists) {
      dateGod = doc.data().date;
      // Set the date we're counting down to
      var countDownDate = new Date(doc.data().timer).getTime();
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


      for(var i = doc.data().trending.length - 1; i >= 0; i--){
        var time = doc.data().trending[i].time;
        console.log("time => ", time);
        var trendingCard = '<section style="background-color: #2E3353; border-radius: 50px;" class="z-depth-5 hoverable"><div class="row"><div class="col m4"><img src="'+doc.data().trending[i].img+'" alt="" class="circle responsive-img z-depth-5" style="margin-top: 5%; margin-left: 15px; height: 40px; width: 40px;"></div><div class="col m5 pull-m2"><h6 class="white-text" style="margin-top: 10%;">'+doc.data().trending[i].first_name+' got '+doc.data().trending[i].kills+' Kills</h6></div><div class="col m3 pull-m1"><p style="margin-top: 8%; font-size: 15px; padding-right: 5%; color: #7482db; padding-top: 10%;">'+ time +'</p></div></div></section>';
        console.log(trendingCard);
        $('#trendingCardSection').append(trendingCard);
      }




    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });


  var path = db.collection("fortnitefrenzy");
  // Player Cards and Live Now
  db.collection("fortnitefrenzy").orderBy("kills", "desc").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(player) {


      // killCard

      var killCard = '<div class="row" style="margin-left: -20%;"><div class="z-depth-5 hoverable" style="height: 100px; background-color: #2E3353; border-radius: 10px;  padding-left: 20px;"><!-- <h3 class="white-text left-align">Varun Vegad</h3> --><div class="row"><div class="col m4 "><h5 class="white-text">' + player.data().full_name + '</h5><p class="white-text" style="margin-top: 1%; margin-left: 2%;">' + player.data().tierPoints + ' Tier PTS | ' + player.data().tier + ' Tier</p></div><div class="col m4"><h2 class="white-text" style="margin-top: 5%; margin-left: 20%;">' + player.data().kills + '<span class="white-text" style="font-size: 30px;">Kills</span></h2></div><div class="col m4"><div class="side-image"><img src="' + player.data().banner + '" style="height: 100px; border-radius: 0px 10px 10px 0px; margin-left: 28%;"/></div></div></div></div></div>';
      $('#killCardSection').append(killCard);



      // Live Now Section
      var twitchLive = 'https://api.twitch.tv/helix/streams/' + player.data().twitch;
      $.get({
        url: 'https://api.twitch.tv/kraken/streams/' + player.data().twitch,
        data: {
          client_id: 'urff2tmjj5swnbqlltvic62bwpn96f'
        },
        error: function(response) {
          console.log("IT DIDNT WORK");
        },
        success: function(response) {
          console.log(player.data().twitch, " => ", response)
          if (response.stream.stream_type == "live") {
            console.log("EVERYTHING IS GUCCI");
            var liveCard = '<section style="background-color: #2E3353; border-radius: 50px;" class="z-depth-5 hoverable"><div class="row"><div class="col m4"><img src="' + response.stream.preview.large + '" alt="" class="circle responsive-img z-depth-5" style="margin-top: 5%; margin-left: 15px; height: 40px; width: 40px;"></div><div class="col m5 pull-m2"><h6 class="white-text" style="margin-top: 10%;">' + player.data().twitch + ' went live</h6></div><div class="col m3 pull-m2" style="margin-top: 2%;"><a href="' + response.stream.channel.url + '" class="waves-effect waves-light btn" style="border-radius: 20px; background-color: #171C2F; width: 150px;">Watch Now</a></div></div></section>';
            $('#liveNow').append(liveCard);
          }
        }
      });
      // Fortnite Master API Section
      var killsGlobal = 0;

      $.get({
        // url: 'https://cors-anywhere.herokuapp.com/https://fortnite.op.gg/api/v1/player/stats/trend/' + player.data().epic + '/' + player.data().platform + '?type=GAME',
        url: 'https://cors-anywhere.herokuapp.com/https://fortnite.op.gg/api/v1/player/match/records/' + player.data().epic + '?seasonId=7&platform=' + player.data().platform + '',
        success: function(response) {
          console.log(player.data().epic, response);
          if (player.data().cursor != response.data.cursor || player.data().cursor == "abc") {
            for (var i = 0; i < response.data.records.length; i++) {
              var d = new Date(response.data.records[i].timestamp);
              var responseDate = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
              // console.log(i, " is:", response.data.records[i].sync_dt.split(" ")[0]);
              if (dateGod == responseDate) {
                console.log("Found", dateGod, "at", i, "=> kills: ", response.data.records[i].kills);
                killsGlobal += response.data.records[i].kills;
              }
            }
            console.log("Total Kills: ", killsGlobal);
            var obj = {
              first_name: player.data().first_name,
              kills: killsGlobal,
              time: moment().format('h:mm a'),
              img: player.data().banner
            };
            docRef.update({
              trending: firebase.firestore.FieldValue.arrayUnion(obj)
            });


            var updatePlayer = db.collection("fortnitefrenzy").doc(player.id);

            // Set the "capital" field of the city 'DC'
            return updatePlayer.update({
              kills: killsGlobal + player.data().kills,
              cursor: response.data.cursor
            });

          }
        }
      });

    });
  });

}
