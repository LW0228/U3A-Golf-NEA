function sSave_fixture(){
    //create uid key for fixture
    var uid = firebase.database().ref().child('scheduledFixtures').push().key;

    //fixture name
    var fixture_name = document.getElementById('sFixture_name').value;

    //fixture address
    var fixture_address1 = document.getElementById('sFixture_address1').value;
    var fixture_address2 = document.getElementById('sFixture_address2').value;
    var fixture_region = document.getElementById('sFixture_region').value;
    var fixture_postalCode = document.getElementById('sFixture_postalCode').value;

    //whether buggies are available
    var buggyAvailable = buggyAvailability.checked;

    //mobility factor
    var fixture_mobFactor = document.getElementById('sFixture_mobFactor').value;
    
    //Number of Holes in venue
    var select = document.getElementById("holes");
    var holes = select.options[select.selectedIndex].value;

    var fixture_open = true;
    
    var address_data = {
        fixture_address1: fixture_address1,
        fixture_address2: fixture_address2,
        fixture_region: fixture_region,
        fixture_postalCode: fixture_postalCode
    }

    var data = {
        fixture_id: uid,
        fixture_name: fixture_name,
        fixture_address: address_data,
        buggy: buggyAvailable,
        fixture_mobFactor: fixture_mobFactor,
        holes: holes,
        fixture_open: fixture_open,
    }

    //make sure name, post code and mobility factor are inputted
    if(fixture_name===""||fixture_postalCode===""||fixture_mobFactor===""){
        alert("You have not inputted all the required fields");
    } else{ 
        //firebase updates record of fixture
        firebase.database().ref("/scheduledFixtures/" + uid).set(data);
        alert('The fixture is created successfully!');
        reload_page();     
    };
};


