

//auth state change
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("logged in")
      // User is signed in.

    } else {
        console.log("user log out")
      // No user is signed in.
    }
});



//saving mobility factor
var user_mobFactor = 0

function save_mobfactor(mob_factor) {
    user_mobFactor = mob_factor;
    return user_mobFactor;
}


//creating user on sign up page
function create_user() {    
    var email = document.getElementById("signUp_email").value;
    var password = document.getElementById("signUp_password").value;

    firebase.auth().createUserWithEmailAndPassword(email,password).then((cred) =>{
        saveData(cred.user.uid);
    }, (error)=>{
        alert(error);
    });
}

//saving data with user uid
function saveData(uid){
    var user_name = document.getElementById('user_name').value;

    var committee_member = com_member.checked;

    var user_address1 = document.getElementById('user_address1').value;
    var user_address2 = document.getElementById('user_address2').value;
    var user_postalCode = document.getElementById('user_postalCode').value;
    
    var address_data = {
        user_address1: user_address1,
        user_address2: user_address2,
        user_postalCode: user_postalCode
    }

    var data = {
        user_id: uid,
        user_name: user_name,
        user_address: address_data,
        user_mobfactor: user_mobFactor,
        user_member: committee_member
    }

    //use uid of created user and make it equal to uid of user data
    firebase.database().ref("users/" + uid).set(data);
    alert("User Created, please sign in with your email and password")
}


//logging user in
function login_user(){
    var email = document.getElementById("user_email").value;
    var password = document.getElementById("user_password").value;

    firebase.auth().signInWithEmailAndPassword(email,password).then((cred)=>{
        window.location.href="fixture.html"
    })
}

//logging user out - used in fixture.html
function logout_user(){
    firebase.auth().signOut().then((cred)=>{
        window.location.href="user.html"
    })
}

