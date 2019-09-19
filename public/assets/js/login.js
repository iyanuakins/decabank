$(document).ready(function () {
    let uri = "http://localhost:3000/users";
    let status = [false, false];

    let isRegistered = localStorage.getItem("isRegistered");
    if(isRegistered == "true") {
        localStorage.removeItem("isRegistered");
        $("#msg-hold").append(`
        <div class="alert alert-success alert-dismissible fade show m-2 p-2 text-center">
            Registration successful, Please login below.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `);
        setTimeout(() => {
            $("#msg-hold").empty();
        }, 3000);
    }

    let isLogout = localStorage.getItem("isLogout");
    if(isLogout == "true") {
        localStorage.removeItem("isLogout");

        $("#msg-hold").append(`
        <div class="alert alert-success alert-dismissible fade show m-2 p-2 text-center">
            Logout successful, Thanks for banking with us.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `);
        setTimeout(() => {
            $("#msg-hold").empty();
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
                        $("#msg-hold").append(`
                            <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                                Authentication failed: Email or Password is incorrect.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `);
                        
                        setTimeout(() => {
                            $("#msg-hold").empty();
                        }, 3000);
                    } else if (user[0].password == password){
                        let data = {userID: user[0].id, timeStamp: Date.now() + 10800000}
                        localStorage.setItem("loggedUser", JSON.stringify(data));
                        $(location).attr("href", '/user/dashboard.html');
                        
                    } else {
                        $("#msg-hold").append(`
                            <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                                Authentication failed: Email or Password is incorrect.
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        `);

                        setTimeout(() => {
                            $("#msg-hold").empty();
                        }, 3000);
                    }
                }
            );
        } else {
            $("#msg-hold").append(`
                <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                    Unable to change password: Correct form fields
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msg-hold").empty();
            }, 3000);
        }
    });
});