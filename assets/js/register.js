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
    let status = [false, false, false, false, false, false, false];

    $("#fname").blur(function (e) { 
        e.preventDefault();
        let firstName = $("#fname").val();
        if (firstName == '') {
            $("#fnameMsg").text("This field is required");
            status[0] = false;
        } else {
            $("#fnameMsg").text("");
            status[0] = true;
        }
    });

    $("#lname").blur(function (e) { 
        e.preventDefault();
        let lastName = $("#lname").val();
        if (lastName == '') {
            $("#lnameMsg").text("This field is required");
            status[1] = false;
        } else {
            $("#lnameMsg").text("");
            status[1] = true;
        }
    });

    $("#email").blur(function (e) { 
        e.preventDefault();
        let email = $("#email").val();
        let emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = emailExp.test(email);
        if (email == '') {
            $("#emailMsg").text("This field is required");
            status[2] = false;
        } else if (!isEmail) {
            $("#emailMsg").text("Enter a valid email address");
            status[2] = false;
        } else {
            $("#emailMsg").text("");
            status[2] = true;
        }
    });
    
    $("#phonenumber").blur(function (e) { 
        e.preventDefault();
        let phonenumber = $("#phonenumber").val();
        let numExp = /\d{11}/;
        let isNum = numExp.test(phonenumber)
        if (phonenumber == '') {
            $("#phNumMsg").text("This field is required");
            status[3] = false;
        } else if (!isNum) {
            $("#phNumMsg").text("Enter a valid phone number");
            status[3] = false;
        } else {
            $("#phNumMsg").text("");
            status[3] = true;
        }
    });

    $("#password").blur(function (e) { 
        e.preventDefault();
        let password = $("#password").val();
        let cPassword = $("#cPassword").val();
        if (password == '') {
            $("#pwMsg").text("This field is required");
            status[4] = false;
        } else if (password.length < 6 || password.length > 32) {
            $("#pwMsg").text("Password must be between 6 to 32 characters");
            status[4] = false;
        } else if (password != '' && cPassword != '' && password != cPassword) {
            $("#cpwMsg").text("Password does not match");
            status[4] = false;
        } else {
            $("#pwMsg").text("");
            status[4] = true;
        }
    });

    $("#cPassword").blur(function (e) { 
        e.preventDefault();
        let password = $("#password").val();
        let cPassword = $("#cPassword").val();
        if (cPassword == '') {
            $("#cpwMsg").text("This field is required");
            status[5] = false;
        } else if (cPassword.length < 6 ||cPassword.length > 32) {
            $("#cpwMsg").text("Password must be between 6 to 32 characters");
            status[5] = false;
        } else if (password != '' && cPassword != '' && password != cPassword) {
            $("#cpwMsg").text("Password does not match");
            status[5] = false;
        } else {
            $("#cpwMsg").text("");
            status[5] = true;
        }
    });

    $("#address").blur(function (e) { 
        e.preventDefault();
        let address = $("#address").val();
        if (address == '') {
            $("#adrMsg").text("This field is required");
            status[6] = false;
        } else {
            $("#adrMsg").text("");
            status[6] = true;
        }
    });

    $("#submit").click(function (e) { 
        e.preventDefault();
        let isValid = status.every((s) => s == true)
        if (isValid) {
            
            let firstName = $("#fname").val();
            let lastName = $("#lname").val();
            let phoneNumber = $("#phonenumber").val();
            let address = $("#address").val();
            let password = $("#password").val();
            let email = $("#email").val();
            
            $.get(uri,
                function (res) {
                  let emailTaken =  res.some((elem) => elem['email'] == email )
                  let numTaken =  res.some((elem) => elem['phoneNumber'] == phoneNumber )

                    if(emailTaken)  {
                        $("#emailMsg").text("Email address entered is already in use");
                    } else if (numTaken) {
                        $("#phNumMsg").text("Phone number has been used by another user");
                    } else {
                        let data = {
                            firstName,
                            lastName,
                            phoneNumber,
                            address,
                            password,
                            email,
                            balance: 0,
                            date: Date.now()
                        }
            
                        $.post(uri, data,
                            function () {
                                let url = "/login.html";
                                localStorage.setItem("isRegistered", true)
                                $(location).attr("href", url);
                            }
                        );
                    }
                }
            );
        } else {
            alert("One or more fields is/are wrong, please correct and resubmit")
        }
    });
});