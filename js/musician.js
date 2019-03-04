function loadMusician() {
  var docRef = db.collection("musicians").doc('farhaanjagtap');

  docRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("Document data:", doc.data());

      //header
      var banner = '<header style="position: relative; height: 450px; "><div class="row container"><div class="col m12 s12"><h2 class="white-text center" style="font-weight: 900;">' + doc.data().name + '</h2></div></div></header>';
      $('#banner').append(banner);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  });
}
