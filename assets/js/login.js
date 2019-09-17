if(!!localStorage.getItem('loggedUser')) {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    let loggedTime = loggedUser.timeStamp;
    let now = Date.now();
    if(loggedTime - now < 0) {
        localStorage.removeItem('loggedUser')
    } else{
        let data = {userID: loggedUser.userID, timeStamp: Date.now() + 10800000}
        localStorage.setItem("loggedUser", JSON.stringify(data));
        $(location).attr("href", '/user/dashboard.html');
    }
}

$(document).ready(function () {
    let uri = "http://localhost:3000/users";
    let status = [false, false];

    $("#msgBox").hide();
    $("#errBox").hide();
    let isRegistered = localStorage.getItem("isRegistered");
    if(isRegistered == "true") {
        localStorage.removeItem("isRegistered");
        $("#msgBox").text("Registration successful, Please login below.");
        $("#msgBox").show()
        setTimeout(() => {
            $("#msgBox").hide();
        }, 3000);
    }

    let isLogout = localStorage.getItem("isLogout");
    if(isLogout == "true") {
        localStorage.removeItem("isLogout");
        $("#msgBox").text("Logout successful, Thanks for saving with us.");
        $("#msgBox").show()
        setTimeout(() => {
            $("#msgBox").hide();
        }, 3000);
    }

    $("#email").blur(function (e) { 
        e.preventDefault();
        let email = $("#email").val();
        let emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = emailExp.test(email);
        if (email == '') {
            $("#emailMsg").text("This field is required");
            status[0] = false;
        } else if (!isEmail) {
            $("#emailMsg").text("Enter a valid email address");
            status[0] = false;
        } else {
            $("#emailMsg").text("");
            status[0] = true;
        }
    });

    $("#password").blur(function (e) { 
        e.preventDefault();
        let password = $("#password").val();
        if (password == '') {
            $("#pwMsg").text("This field is required");
            status[1] = false;
        } else if (password.length < 6 || password.length > 32) {
            $("#pwMsg").text("Password must be between 6 to 32 characters");
            status[1] = false;
        } else {
            $("#pwMsg").text("");
            status[1] = true;
        }
    });

     
    $("#submit").click(function (e) { 
        e.preventDefault();
        let isValid = status.every((s) => s == true)
        if (isValid) {
            let email = $("#email").val();
            let password = $("#password").val();
            
            $.get(uri,
                function (res) {
                    let user = res.filter((data) => data["email"] == email);

                    if(!user.length) {
                        $("#errBox").show()

                        setTimeout(() => {
                            $("#errBox").hide();
                        }, 3000);

                    } else if (user[0].password == password){
                        let data = {userID: user[0].id, timeStamp: Date.now() + 10800000}
                        localStorage.setItem("loggedUser", JSON.stringify(data));
                        $(location).attr("href", '/user/dashboard.html');
                        
                    } else {
                        $("#errBox").show()

                        setTimeout(() => {
                            $("#errBox").hide();
                        }, 3000);
                    }
                }
            );
        } else {
            alert("One or more fields is/are wrong, please correct and resubmit")
        }
    });
});