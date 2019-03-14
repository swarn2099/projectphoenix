var valid = false;

function loadData() {
  db.collection("apex").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(team) {
      var path = db.collection("apex").doc(team.id)
      // Player 1
      var counter = 0;
      var player1 = {
        "async": true,
        "crossDomain": true,
        "url": 'https://cors-anywhere.herokuapp.com/https://public-api.tracker.gg/apex/v1/standard/profile/' + team.data().player1.platform + '/' + team.data().player1.name,
        "method": "GET",
        "headers": {
          "TRN-Api-Key": "1a753f25-4dce-4936-8092-554a2b44b927",
          "cache-control": "no-cache",
          "Postman-Token": "4c031e3e-695e-47de-b078-6c71a76badf2"
        }
      };
      var tempArr = [];
    
      $.ajax(player1).done(function(apex) {
        console.log(apex);
        var killsAPI = apex.data.stats.find(o => o.metadata.key === 'Kills');
        var top3API = apex.data.stats.find(o => o.metadata.key === 'TimesPlacedtop3');
        // var unqiueAPI = apex.data.stats.find(o => o.metadata.key === 'Finshers');
        var obj = {
          name: apex.data.metadata.platformUserHandle,
          killsAPI: killsAPI.value,
          top3API: top3API.value
        }
        tempArr.push(obj);
        counter++;
        console.log(counter);
        // initialize player 1
        if(team.data().player1.init == false){
          console.log("Initializing player 1");
          path.update({
            "player1.kills": tempArr[0].killsAPI,
            "player1.top3": tempArr[0].top3API,
            "player1.init": true
          });
        }
        // Player 2
        var player2 = {
          "async": true,
          "crossDomain": true,
          "url": 'https://cors-anywhere.herokuapp.com/https://public-api.tracker.gg/apex/v1/standard/profile/' + team.data().player2.platform + '/' + team.data().player2.name,
          "method": "GET",
          "headers": {
            "TRN-Api-Key": "1a753f25-4dce-4936-8092-554a2b44b927",
            "cache-control": "no-cache",
            "Postman-Token": "4c031e3e-695e-47de-b078-6c71a76badf2"
          }
        };
        $.ajax(player2).done(function(apex) {
          console.log(apex);
          var killsAPI = apex.data.stats.find(o => o.metadata.key === 'Kills');
          var top3API = apex.data.stats.find(o => o.metadata.key === 'TimesPlacedtop3');
          // var unqiueAPI = apex.data.stats.find(o => o.metadata.key === 'Finshers');
          var obj = {
            name: apex.data.metadata.platformUserHandle,
            killsAPI: killsAPI.value,
            top3API: top3API.value
          }
          tempArr.push(obj);
          counter++;
          console.log(counter);
          // initialize player 2
          if(team.data().player2.init == false){
            console.log("Initializing player 2");
            path.update({
              "player2.kills": tempArr[1].killsAPI,
              "player2.top3": tempArr[1].top3API,
              "player2.init": true
            });
          }
          // Player 3
          var player3 = {
            "async": true,
            "crossDomain": true,
            "url": 'https://cors-anywhere.herokuapp.com/https://public-api.tracker.gg/apex/v1/standard/profile/' + team.data().player3.platform + '/' + team.data().player3.name,
            "method": "GET",
            "headers": {
              "TRN-Api-Key": "1a753f25-4dce-4936-8092-554a2b44b927",
              "cache-control": "no-cache",
              "Postman-Token": "4c031e3e-695e-47de-b078-6c71a76badf2"
            }
          };
          $.ajax(player3).done(function(apex) {
            console.log(apex);
            var killsAPI = apex.data.stats.find(o => o.metadata.key === 'Kills');
            var top3API = apex.data.stats.find(o => o.metadata.key === 'TimesPlacedtop3');
            // var unqiueAPI = apex.data.stats.find(o => o.metadata.key === 'Finshers');
            var obj = {
              name: apex.data.metadata.platformUserHandle,
              killsAPI: killsAPI.value,
              top3API: top3API.value
            }
            tempArr.push(obj);
            counter++;
            console.log(counter);
            // initialize player 3
            if(team.data().player3.init == false){
              console.log("Initializing Player 3");
              path.update({
                "player3.kills": tempArr[2].killsAPI,
                "player3.top3": tempArr[2].top3API,
                "player3.init": true
              });
            }
            if (counter == 3) {
              console.log(tempArr);
              if(tempArr[0].top3API == (team.data().player1.top3 + 1)){
                console.log("TOP3 found for player 1");
                if(tempArr[1].top3API == (team.data().player2.top3 + 1)){
                  console.log("TOP3 found for player 2");
                  if(tempArr[2].top3API == (team.data().player3.top3 + 1)){
                    var diff1 = tempArr[0].killsAPI - team.data().player1.kills;
                    var diff2 = tempArr[1].killsAPI - team.data().player2.kills;
                    var diff3 = tempArr[2].killsAPI - team.data().player3.kills;
                    console.log("Player 1: ", diff1);
                    console.log("Player 2: ", diff2);
                    console.log("Player 3: ", diff3);
                    var feedObj1 = {
                      name: tempArr[0].name,
                      difference: diff1,
                      time: moment().format('h:mm a'),
                      img: team.data().banner
                    };
                    var feedObj2 = {
                      name: tempArr[1].name,
                      difference: diff2,
                      time: moment().format('h:mm a'),
                      img: team.data().banner
                    };
                    var feedObj3 = {
                      name: tempArr[2].name,
                      difference: diff3,
                      time: moment().format('h:mm a'),
                      img: team.data().banner
                    };

                    if(diff1 > team.data().player1.diff){
                      // update player1 diff
                      path.update({
                        "player1.diff": diff1,
                        "player1.top3": tempArr[0].top3API
                      });
                      db.collection('tournaments').doc('apexarena').update({
                        feed: firebase.firestore.FieldValue.arrayUnion(feedObj1)
                      });
                    }
                    if (diff2 > team.data().player2.diff) {
                      // update player2 diff
                      path.update({
                        "player2.diff": diff2,
                        "player2.top3": tempArr[1].top3API
                      });
                      db.collection('tournaments').doc('apexarena').update({
                        feed: firebase.firestore.FieldValue.arrayUnion(feedObj2)
                      });
                    }
                    if (diff3 > team.data().player3.diff) {
                      // update player2 diff
                      path.update({
                        "player3.diff": diff3,
                        "player3.top3": tempArr[2].top3API
                      });
                      db.collection('tournaments').doc('apexarena').update({
                        feed: firebase.firestore.FieldValue.arrayUnion(feedObj3)
                      });
                    }
                  }
                }
              }
              // update kills for all players
              path.update({
                "player1.kills": tempArr[0].killsAPI,
                "player2.kills": tempArr[1].killsAPI,
                "player3.kills": tempArr[2].killsAPI
              });
            }
          });
        });
      });
    });
  });
}
