
//all admin classes
const adminItems = document.querySelectorAll('.admin');
const WednesdayItems = document.querySelectorAll('.wednesday');


//auth state change
firebase.auth().onAuthStateChanged(function (user) {
    // User is signed in
    if (user) {
        //token of user
        user.getIdTokenResult().then(function(idTokenResult){
            console.log(idTokenResult.claims)
            //set to true if admin
            user.admin = idTokenResult.claims.admin;
            user.Wednesday =idTokenResult.claims.Wednesday;
        }).then(function(){
            if(user.admin){
                //show if admin
                adminItems.forEach(item => item.style.display ='block');
                console.log("admin");
            } else{
                //if Wednesday member show
                if(user.Wednesday){
                    WednesdayItems.forEach(item => item.style.display ='block');
                }
                console.log("not admin");
            };
            
        });
        console.log("logged in")
    } else {
        console.log("user logged out")
    };
});


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
        window.location.href="index.html"
    })
}

function reload_page() {
    window.location.reload();
}

// setup materialize component
document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});
