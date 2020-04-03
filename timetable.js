var prefPair_list=[]
var prefTime_list=[]

//add as Wednesday member
function wednesdayUser(){
    //get email
    var wednesdayEmail = document.getElementById('wednesdayEmail').value;
    
    //go through users in database
    firebase.database().ref("/users/").once("value").then(function (snapshot) {
        snapshot.forEach(function(childSnapshot){
            var user = childSnapshot.val();
            var user_id = childSnapshot.key;
            var user_email = user.user_email;

            //find user in database with email
            checkUser(user_email, user_id)
        });
    });
    
    function checkUser(email, uid){
        //if email of user found
        if(email == wednesdayEmail){
            //go through booking database
            firebase.database().ref("/bookings/").once("value").then(function (snapshot) {
                snapshot.forEach(function(childSnapshot){
                    var bookings = childSnapshot.val();
                    var bookings_userID = bookings.user_id;
                    //find all bookings of the user
                    if(bookings_userID == uid){
                        //list all their preferred pairing and timings
                        preference(bookings);
                        };
                    });
            }).then(function(){
                //most chosen pairing
                var prefPair = mode(prefPair_list);
                //most chosen timing
                var prefTime = mode(prefTime_list);

                var data = {
                    pref_pair: prefPair,
                    pref_time: prefTime,
                }

                //preferences added onto user data
                firebase.database().ref("users/" + uid + "/wednesday/").set(data);
                
                //add admin cloud function
                const addWednesday = firebase.functions().httpsCallable('addWednesday');
                addWednesday({ email : email}).then(function(result){
                    alert(result.data.message);
                    })
                });
                
        };
    };
};

//push preferences onto list
function preference(bookingDetails){
    prefPair = bookingDetails.booking_pair;
    prefTime = bookingDetails.booking_time;
    prefPair_list.push(prefPair);
    prefTime_list.push(prefTime);   
};


//find most common in list
function mode(list){
    //key:value pair
    var modeMap = {};
    
    //start max at first item in list
    var modal = list[0];
    var maxCount = 1;

    //go through list
    for(var i = 0; i < list.length; i++){
        //key is item in list
        var el = list[i];
        //value is number of occurances
        if(modeMap[el] == null){  
            modeMap[el] = 1;
        }else{
            //increment value
            modeMap[el]++;  
        }
        
        //replace modal with higher occurance
        if(modeMap[el] > maxCount){
            modal = el;
            maxCount = modeMap[el];
        }
    }
    //list of all values
    var occurances = Object.values(modeMap);
    
    if(occurances.every((val,i,arr)=>val===arr[0])==true){
        //if all the values are the same
        return "dMind";
    } else{
        return modal;
    };
};



//retrieve fixture data from database and make collapsible list and modal
firebase.database().ref("/scheduledFixtures/").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var fixtures = childSnapshot.val();

        var name = fixtures.fixture_name;
        var address = fixtures.fixture_address;
        var buggy = fixtures.buggy;
        var mobFactor = fixtures.fixture_mobFactor;
        var holes = fixtures.holes;
        var open = fixtures.fixture_open;
        var uid = fixtures.fixture_id;

        //collapsible list
        fixtureList(name, address, buggy, mobFactor, holes, open);

        //modal for admins to change availability per week
        modalContent(name , uid);
    });
});

//return whether buggy required or not
function buggyRequired(buggy){
    if(buggy ==true ){
        return "Buggy Available";
    } else{
        return "Buggy not available";
    };
};

//cannot see venue if not available next week
function hide(open){
    if(open !=true){
        return `style="display: none;"`;
    };
};

//link to html collapsible 
const list = document.querySelector('.guides');

//Collapsible list
function fixtureList(name, address, buggy, mobFactor, holes, open) {
    
    //Information for each fixture
    var li = `
        <li ${hide(open)}>
            <div class="collapsible-header grey lighten-4"> ${name} </div>

            <div class="collapsible-body white"> 

                <p> Address of Venue: <br>${address.fixture_address1} <br> ${address.fixture_address2} <br> ${address.fixture_region} <br>${address.fixture_postalCode}</p> <br>
                
                <p> Mobility factor : ${mobFactor} </p>     
                
                <p> ${buggyRequired(buggy)} </p>

                <p> No. of Holes : ${holes}<p>

            </div>

        </li>
    `;
    list.innerHTML += li;
};

//link to html modal
const modal = document.querySelector('.content');

//Create checkbox for each Wednesday fixture
function modalContent(name, uid){
        //Information for each fixture
        var content = `
            <label>
                <input type="checkbox" id="${uid}" />
                <span>${name}</span>
            </label>
            <br>
        `;
    modal.innerHTML += content;
}

//get inputted data and update if fixture available on firebase
function availability(){
    //scheduled fixture database
    firebase.database().ref("/scheduledFixtures/").once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
        var fixtures = childSnapshot.val();
        var fixtureId = fixtures.fixture_id;

        //fixture checked or not
        available = document.getElementById(fixtureId).checked;
        //change availability
        firebase.database().ref("/scheduledFixtures/" + fixtureId + "/fixture_open/").set(available);
        });
    }).then(alert("Venues updated")).then(reload_page());
};