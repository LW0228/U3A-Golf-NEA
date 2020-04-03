
//count
i=0

//retrieve fixture data from database
firebase.database().ref("/fixtures/").orderByChild("fixture_date").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var fixtures = childSnapshot.val();

        var uid=fixtures.fixture_id;
        var name = fixtures.fixture_name;
        var date = fixtures.fixture_date;
        var address = fixtures.fixture_address;
        var price = fixtures.fixture_price;
        var buggy = fixtures.buggy;
        var mobFactor = fixtures.fixture_mobFactor;
        var timings = fixtures.timings;
        var food = fixtures.fixture_food;
        var comments = fixtures.fixture_comments;
        var maxBookings = fixtures.maximumBookings;
        var played = fixtures.played;

        if (played!==true){
            fixtureList(name, date, address, price, buggy, mobFactor, timings, food, comments, i, uid, maxBookings);
        };

        userList(i);
        i+=1;
    });
});



//retrieve user data from database
function userList(i){
    firebase.database().ref("/users/").once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            //get username for each user
            var name = childSnapshot.val().user_name;
            var uid = childSnapshot.val().user_id;
            var userID = firebase.auth().currentUser.uid
            if(uid!=userID){
                //name of user passed into function
                appendName(name, i)
            }
        });
    });
}

//add user name as an option into SELECT
function appendName(name, i) {
    var prefPair=document.getElementById("prefPair"+i);
    var newName = document.createElement("option");
    newName.text = name;
    newName.setAttribute("value", name);
    prefPair.appendChild(newName);
}; 

//buggy available and checkbox to have buggy
function buggyAvailable(buggy) {
    if (buggy == true) {
        var show = `
        <label>
            <input type="checkbox" id="buggyRequired" />
            <span>Buggy Required</span>
        </label>
        `
        return show
    } else {
        return "Buggy unavailable at this venue"
    }
}

//disable radio if timings do not exist for that number of holes
function isNull(timee){
    if(timee===""){
        return `disabled`
    } else{
        return null
    }
}

//link to html collapsible 
const list = document.querySelector('.guides');

//Collapsible list
function fixtureList(name, date, address, price, buggy, mobFactor, timings, food, comments, i, uid, maxBookings) {

    //Information and input for fixture booking
    var li = `
        <li>
            <div class="collapsible-header grey lighten-4"> ${date + ' ' + name} </div>

            <div class="collapsible-body white"> 
                <p>Price: £${price} </p>

                <p> Address of Venue: <br>${address.fixture_address1} <br> ${address.fixture_address2} <br> ${address.fixture_region} <br>${address.fixture_postalCode}</p>
                
                <p> Mobility factor : ${mobFactor} </p>               
                
                <p> ${buggyAvailable(buggy)} </p> <br>

                <div> Tee times: 
                    <p>
                        <label>
                        <input class="with-gap" name="holes" value=9 type="radio" id="holes" ${isNull(timings.time9)} onclick="save_holes(this.value)" />
                        <span>9 Holes : ${timings.time9}</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="holes" type="radio" value=12 id="holes" ${isNull(timings.time12)} onclick="save_holes(this.value)"/>
                        <span>12 Holes : ${timings.time12}</span>
                        </label>
                    </p>
                    <p>
                        <label>
                        <input class="with-gap" name="holes" type="radio" value=18 id="holes" ${isNull(timings.time18)} onclick="save_holes(this.value)"/>
                        <span>18 Holes : ${timings.time18}</span>
                        </label>
                    </p>
                </div>

                <p> Comments on Food - ${food} </p>
                
                <p> Additional Comments - ${comments} </p>

                <div class="row"> 
                    <label>Preferred Pairing</label>
                    <select class="browser-default" id="prefPair${i}" >
                        <option value="" disabled selected>Choose your option</option>
                        <option value="dMind">Don't Mind</option>
                    </select>
                </div>
        
                <div class="row"> 
                    <label>Preferred Timings</label>
                    <select class="browser-default" id="prefTime${i}" >
                        <option value="disable" disabled selected>Choose your option</option>
                        <option value="dMind"> Don't Mind</option>
                        <option value="first"> First</option>
                        <option value="last"> Last</option>
                    </select>
                </div>

                <div>
                    <input type="button" class="btn btn-lg btn-primary" value="Book Fixture" id="createFixture" onclick="create_fixture('${uid}',${i},${maxBookings})">
                </div>

            </div>
        </li>
    `;
    list.innerHTML += li;
};
