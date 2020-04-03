//check user hasn't booked specific fixture
var currentList=0

var numberHoles = 0
//collect value from radio picked
function save_holes(holes){
    numberHoles = holes;
    return numberHoles
}


function create_fixture(id,i,maxBookings){
    //number of people who has booked the fixture
    var currentList_number = 0

    //create data within booking
    var uid = firebase.database().ref().child('bookings').push().key;

    //UID of fixture passed as parameter
    var fixtureID = id
    
    //uid of user currently logged in
    var userID = firebase.auth().currentUser.uid;

    //if buggy is available/checked    
    var buggy = document.getElementById("buggyRequired").checked;

    //which option is selected from select
    //preferred pairing
    var select = document.getElementById("prefPair"+i);
    var pair = select.options[select.selectedIndex].value;

    //preferred timings
    var sel = document.getElementById("prefTime"+i);
    var time =  sel.options[sel.selectedIndex].value;

    var data={
        fixture_id: fixtureID,
        user_id: userID,
        booking_holes: numberHoles,
        booking_buggy: buggy,
        booking_pair: pair,
        booking_time: time,
    }

    //save in firebase
    firebase.database().ref("/fixtures/" + id + '/currentList/').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot){
            currentID = childSnapshot.val();
            currentList_number +=1
            checkSame(currentID)
            
        });
    }).then(function(){

    //require fields to be filled in
    if(numberHoles == 0|| pair=="" || time=="") {
        alert("Please fill in all the fields");
    }
    //if user ID is in current list of fixture
     else if(currentList >0){
        alert("Sorry, you have already booked this fixture");
    }
    //if current bookings exceed maximum booking allowance
     else if(currentList_number >= maxBookings) {
        //how long to wait
        waitNumber = currentList_number - maxBookings + 1

        alert("Sorry, you are number " + waitNumber +" on the waiting list")
        
        //booking database updated
        firebase.database().ref("/bookings/" + uid).set(data);

        //fixture current list updated
        firebase.database().ref("/fixtures/" + id + '/currentList/').push(userID);

        alert("You have booked this fixture");

    } else {    
        //booking database updated
        firebase.database().ref("/bookings/" + uid).set(data);

        //fixture current list updated
        firebase.database().ref("/fixtures/" + id + '/currentList/').push(userID);

        alert("You have booked this fixture");
        };
        reload_page();
    });
    
    //userID the same as ID in fixture currentList
    function checkSame(current){
        if(current == userID){
            currentList +=1
        };
    };
}

