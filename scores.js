//count for which collapsible
i=0

//retrieve fixture data from database
firebase.database().ref("/fixtures/").orderByChild("fixture_date").once("value").then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var fixtures = childSnapshot.val();

        var uid=fixtures.fixture_id;
        var name = fixtures.fixture_name;
        var date = fixtures.fixture_date;
        var played = fixtures.played;

        var currentList = fixtures.currentList;
        //create collapsible
        fixtureList(name, date, uid,currentList,i,played);
        i +=1
    })
})

//get uid of users in fixtures current list
function handicapList(currentList, i,fixtureId){
    if (currentList !=undefined){
        `Handicap score`
        Object.values(currentList).forEach(function(uid){
            if(uid !=undefined){
                //retrieve user data from database
                userList(uid, i,fixtureId);
            };
        });
        return ``;
    } else{
        return `<br>Nobody has booked this fixture yet</br>`
    };
};

//create input for scores
function userList(uid, i,fixtureId){
    //user table
    firebase.database().ref("/users/" + uid).once('value').then(function (snapshot) {
        //get username of uid
        var name = snapshot.val().user_name;

        //for each collapsible
        var scores=document.getElementById("score"+i);

        //input for scores
        var x = document.createElement("INPUT");
        x.setAttribute("type", "number");
        x.setAttribute("class", fixtureId);
        x.setAttribute("id", name);
        x.setAttribute("name", uid);
        x.placeholder = name
        scores.appendChild(x);

    });
}

//change from grey to brown if already inputted scores
function status(played){
    if(played==true){
        return `brown`;
    } else{
        return `grey`;
    };
};

//if scores are already inputted, cannot delete fixture
function disableButton(played){
    if (played==true){
        return `disabled`
    } else{
        return``
    }
}



//link to html collapsible 
const scores = document.querySelector('.scores');

//Collapsible list
function fixtureList(name, date, fixtureId, currentList, i, played) {

    //List of booked users of fixture to input scores
    var li = `
            <li>
            <div class="collapsible-header ${status(played)} lighten-4"> ${date + ' ' + name} </div>

            <div class="collapsible-body white"> 
                <h5>Handicap Scores</h5>

                <p id="score${i}"> Please input each members scores for this fixture
                ${handicapList(currentList,i,fixtureId)}
                </p>

                <div>
                    <input type="button" class="right btn btn-lg btn-primary ${disableButton(played)}" value="Delete Fixture" id="Delete Fixture" onclick="delete_fixture('${fixtureId}',${played})">
                </div>

                <div>
                    <input type="button" class="btn btn-lg btn-primary" value="Save Scores" id="Save Scores" onclick="save_scores('${fixtureId}')">
                </div>



            </div>
        </li>
    `;
    scores.innerHTML += li;
};

//save scores of fixture
function save_scores(fixtureId){
    //for the specific fixture input
    list = document.getElementsByClassName(fixtureId);

    for (var i=0, len=list.length|0; i<len; i=i+1|0) {
        //name of user
        name = list[i].id;
        //uid of user
        userId = list[i].name;
        console.log(userId)
        //score inputted
        score = list[i].value;

        //saved to firebase
        if(list[i].value!=""){
            //save in fixtures table 
            firebase.database().ref("/fixtures/" + fixtureId + "/scores/").child(name).set(score);
            firebase.database().ref("/fixtures/" + fixtureId + "/played/").set(true);
            //save in user table
            firebase.database().ref("/users/"+ userId + "/scores/").child(fixtureId).set(score);
        };
    };
    alert("You have updated the handicap scores for this fixture");
    reload_page()
}


//delete fixture from booking and fixture table
function delete_fixture(fixtureId){
    firebase.database().ref("/bookings/").once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var fixtures = childSnapshot.val();
            var id = fixtures.fixture_id;
            var key = childSnapshot.key;

            if(id==fixtureId){
                firebase.database().ref("/bookings/" + key).remove();
            };
        });
    })
    //remove from fixtures
    .then(firebase.database().ref("/fixtures/" + fixtureId).remove())
    //alert and reload page
    .then(alert("You have deleted this fixture"))
    .then(reload_page());
}