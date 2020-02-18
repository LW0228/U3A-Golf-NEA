
function save_fixture(){
    var fixture_name = document.getElementById('fixture_name').value;
    var uid = firebase.database().ref().child('fixtures').push().key;

    var fixture_date = document.getElementById('fixture_date').value;

    var fixture_address1 = document.getElementById('fixture_address1').value;
    var fixture_address2 = document.getElementById('fixture_address2').value;
    var fixture_region = document.getElementById('fixture_region').value;
    var fixture_postalCode = document.getElementById('fixture_postalCode').value;

    var price = document.getElementById('price').value;

    var buggyAvailable = buggyAvailability.checked

    var maximumBookings = document.getElementById('maximumBookings').value;

    var fixture_mobFactor = document.getElementById('fixture_mobFactor').value;

    var time9 = document.getElementById('time9').value;
    var time12 = document.getElementById('time12').value;
    var time18 = document.getElementById('time18').value;

    var food = document.getElementById('food').value;
    var comments = document.getElementById('comments').value;



    var timings_data = {
        time9: time9,
        time12: time12,
        time18: time18
    }

    var address_data = {
        fixture_address1: fixture_address1,
        fixture_address2: fixture_address2,
        fixture_region: fixture_region,
        fixture_postalCode: fixture_postalCode
    }

    var data = {
        fixture_id : uid,
        fixture_name: fixture_name,
        fixture_date: fixture_date,
        fixture_address: address_data,
        fixture_price: price,
        buggy: buggyAvailable,
        maximumBookings: maximumBookings,
        fixture_mobFactor: fixture_mobFactor,
        timings: timings_data,
        fixture_food: food,
        fixture_comments: comments
    }



    if(fixture_name===""||fixture_date===""||fixture_postalCode===""||price===""||maximumBookings===""||fixture_mobFactor===""){
        alert("You have not inputted all the required fields");
    } else{
        var updates = {};
        //dk why i dont need timings_data or address_data
        updates['/fixtures/' + uid + fixture_name + fixture_date + price + buggyAvailable + maximumBookings + fixture_mobFactor + food + comments] = data;
        firebase.database().ref().update(updates);
    
        alert('The fixture is created successfully!');
        reload_page();     
    }
}

function reload_page() {
window.location.reload();
}
