
//get data from bookings
firebase.database().ref("/bookings/").once("value").then(function (snapshot) {
    snapshot.forEach(function(childSnapshot){
        var bookings = childSnapshot.val();
        var key = childSnapshot.key;
        //get user id from each booking
        var user = bookings.user_id;
        checkUser(user,bookings,key);
    });
});

//get data for bookings with the same user ID as the logged in user ID
function checkUser(bookingUser, bookingDetail,bookingKey){
    //logged in user ID
    var userID = firebase.auth().currentUser.uid;

    if (bookingUser==userID){

        fixtureId = bookingDetail.fixture_id;
        //get all fixtures user signed up to 
        firebase.database().ref("/fixtures/" + fixtureId).once('value').then(function(snapshot){
            fixtures = snapshot.val()

            var name = fixtures.fixture_name;
            var date = fixtures.fixture_date;
            var address = fixtures.fixture_address;
            var price = fixtures.fixture_price;
            var mobFactor = fixtures.fixture_mobFactor;
            var timings = fixtures.timings;
            var food = fixtures.fixture_food;
            var comments = fixtures.fixture_comments;

            var buggy = bookingDetail.booking_buggy;
            var holes = bookingDetail.booking_holes;
            var pair = bookingDetail.booking_pair;
            var time = bookingDetail.booking_time;
            var fixtureKey = snapshot.key;
            
            //display all details of each fixture in collapsible list
            fixtureList(name, date, address, price, buggy, mobFactor, timings, food, comments, holes, pair, time, bookingKey, fixtureKey, userID);
        });
}}

//return whether buggy required or not
function buggyRequired(buggy){
    if(buggy ==true ){
        return "Buggy required"
    } else{
        return "Buggy not required"
    }
}


//give timings of number of holes chosen
function pickedTime(timings,holes){
    if(holes == 9){
        return timings.time9
    } else if(holes == 12){
        return timings.time12
    } else{
        return timings.time18
    }
}

//preferred pairings
function prefPair(pair){
    if(pair=="dMind"){
        return "Don't mind"
    } else{
        return pair
    }
}

//preferred timings
function prefTime(time){
    if(time == "first"){
        return "Near the start"
    } else if(time == "last"){
        return "Near the end"
    } else{
        return "Don't mind"
    }
}


//link to html collapsible 
const list = document.querySelector('.guides');

//Collapsible list
function fixtureList(name, date, address, price, buggy, mobFactor, timings, food, comments, holes, pair,time, bookingKey, fixtureKey, userID) {

    //Information for each fixture
    var li = `
        <li>
            <div class="collapsible-header grey lighten-4"> ${date + ' ' + name} </div>

            <div class="collapsible-body white"> 
                <p>Price: £${price} </p>

                <p> Address of Venue: <br>${address.fixture_address1} <br> ${address.fixture_address2} <br> ${address.fixture_region} <br>${address.fixture_postalCode}</p>
                
                <p> Mobility factor : ${mobFactor} </p>               
                
                <p> ${buggyRequired(buggy)} </p> <br>

                <p> Start Tee time : ${pickedTime(timings,holes)} (${holes} holes)<p>

                <p> Preferred Pairing : ${prefPair(pair)} </p> 

                <p> Preferred Time : ${prefTime(time)} </p> 

                <p> Comments on Food - ${food} </p>
                
                <p> Additional Comments - ${comments} </p>

                <div>
                    <input type="button" class="btn btn-lg btn-primary" value="Delete Fixture" id="deleteFixture" onclick="deleteFixture('${bookingKey}','${fixtureKey}','${userID}')">
                </div>
            </div>

        </li>
    `;
    list.innerHTML += li;
}

//delete booking from booking table and delete userID from current list in fixture table
function deleteFixture(booking,fixture,userID){
    
    //go through current list of fixture
    firebase.database().ref("/fixtures/" + fixture + '/currentList/').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot){
            userList = childSnapshot;
            
            //deletes specified data
            deletes(userList, userID, fixture, booking);
        });
    }).then(alert("Deleted fixture")).then(reloadPage());
}

function deletes(userList, userID, fixture, booking){
    //when user in current list is same as user ID of signed in user
    if(userList.val()==userID){
        //get key of user
        keyUser = userList.key;

        //remove userID from current list
        firebase.database().ref("/fixtures/"+ fixture + "/currentList/" + keyUser).remove();

        //remove booking from booking table
        firebase.database().ref("/bookings/" + booking).remove();
    }
}
