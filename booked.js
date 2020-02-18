

var numberHoles = 0

function save_holes(holes){
    numberHoles = holes;
    return numberHoles
}


function create_fixture(id,i){
    //create data within booking
    var uid = firebase.database().ref().child('bookings').push().key;

    var fixtureID = id
    
    //uid of user currently logged in
    var userID = firebase.auth().currentUser.uid;

    //whether buggy is available/checked    
    var buggy = document.getElementById("buggyRequired").checked;
    


    var time = document.getElementById("prefTime").value;

    //which option is selected from select
    var e = document.getElementById("prefPair"+i);
    var pair = e.options[e.selectedIndex].value;

    var data={
        fixture_id: fixtureID,
        user_id: userID,
        booking_holes: numberHoles,
        booking_buggy: buggy,
        booking_pair: pair,
        booking_time: time,
    }

    var updates={}
    updates["/bookings/" + uid + fixtureID + userID + numberHoles + time] = data
    firebase.database().ref().update(updates);

    alert("You have booked this fixture")
}

