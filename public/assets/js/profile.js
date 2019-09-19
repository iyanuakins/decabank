$(document).ready(function () {
    let status = [true, true, true, true, true, false];
    let passStatus = [false, false, false];
    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let isValid = false;
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";
    let user;
    $.get(`${userUrl}/${userID}`,
        function (res) {
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.lastName}`);
            $("#up-lname").val(res.lastName);
            $("#up-fname").val(res.firstName);
            $("#up-email").val(res.email);
            $("#up-phonenumber").val(res.phoneNumber);
            $("#up-address").val(res.address);
            $("#lname").val(res.lastName);
            $("#fname").val(res.firstName);
            $("#email").val(res.email);
            $("#phonenumber").val(res.phoneNumber);
            $("#address").val(res.address);
            $("#dateReg").text(`Date Registered: ${new Date(parseInt(res.date)).toUTCString()}`);
            localStorage.setItem("response", JSON.stringify(res));
        }
    );

    setTimeout(() => {
        user = JSON.parse(localStorage.getItem("response"));
        localStorage.removeItem('response');
    }, 1000);

    $("#fname").blur(function (e) { 
        e.preventDefault();
        let firstName = $("#fname").val();
        if (firstName == '') {
            $("#fname-msg").text("This field is required");
            status[0] = false;
        } else {
            $("#fname-msg").text("");
            status[0] = true;
        }
    });

    $("#lname").blur(function (e) { 
        e.preventDefault();
        let lastName = $("#lname").val();
        if (lastName == '') {
            $("#lname-msg").text("This field is required");
            status[1] = false;
        } else {
            $("#lname-msg").text("");
            status[1] = true;
        }
    });

    $("#email").blur(function (e) { 
        e.preventDefault();
        let email = $("#email").val();
        let emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isEmail = emailExp.test(email);
        if (email == '') {
            $("#email-msg").text("This field is required");
            status[2] = false;
        } else if (!isEmail) {
            $("#email-msg").text("Enter a valid email address");
            status[2] = false;
        } else {
            $("#email-msg").text("");
            status[2] = true;
        }
    });
    
    $("#phonenumber").blur(function (e) { 
        e.preventDefault();
        let phonenumber = $("#phonenumber").val();
        let numExp = /\d{11}/;
        let isNum = numExp.test(phonenumber)
        if (phonenumber == '') {
            $("#ph-msg").text("This field is required");
            status[3] = false;
        } else if (!isNum) {
            $("#ph-msg").text("Enter a valid phone number");
            status[3] = false;
        } else {
            $("#ph-msg").text("");
            status[3] = true;
        }
    });

    $("#address").blur(function (e) { 
        e.preventDefault();
        let address = $("#address").val();
        if (address == '') {
            $("#adr-msg").text("This field is required");
            status[4] = false;
        } else {
            $("#adr-msg").text("");
            status[4] = true;
        }
    });

    $("#upCurPassword").blur(function (e) { 
        e.preventDefault();
        let upCurPassword = $("#upCurPassword").val();
        if (upCurPassword == '') {
            $("#upCurMsg").text("This field is required");
            status[5] = false;
        } else if (upCurPassword.length < 6 ||upCurPassword.length > 32) {
            $("#upCurMsg").text("Password must be between 6 to 32 characters");
            status[5] = false;
        } else {
            $("#upCurMsg").text("");
            status[5] = true;
        }
    });

    $("#update-submit").click(function (e) { 
        e.preventDefault();
        let isValid = status.every((s) => s == true)
        

        if (isValid) {
            let upCurPassword = $("#upCurPassword").val();


            if (upCurPassword == user.password) {
                let email = $("#email").val();
                let phoneNumber = $("#phonenumber").val();
                
                $.get(userUrl,
                    function (res) {
                      let emailTaken =  res.some((elem) => elem['email'] == email )
                      let numTaken =  res.some((elem) => elem['phoneNumber'] == phoneNumber )
                        
                        if(emailTaken && email != user.email)  {
                            $("#update-msg").append(`
                                <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                                    Unable to update profile: Email already in use.
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            `);

                            setTimeout(() => {
                                $("#update-msg").empty();
                            }, 3000);
                        } else if (numTaken && phoneNumber != user.phoneNumber) {
                            $("#update-msg").append(`
                                <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                                    Unable to update profile: Phone number already in use.
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            `);

                            setTimeout(() => {
                                $("#update-msg").empty();
                            }, 3000);
                        } else { 
                            let firstName = $("#fname").val();
                            let lastName = $("#lname").val();
                            let address = $("#address").val();

                            let newUserData = {
                                firstName,
                                lastName,
                                phoneNumber,
                                address,
                                email
                            }
                        
                            $.ajax({
                                type: "patch",
                                url: `${userUrl}/${userID}`,
                                data: newUserData,
                                dataType: "json",
                                success: function (res) {
                                    localStorage.setItem("update", 'profile');
                                    $(location).attr("href", '/user/dashboard.html');
                                }
                            });
                        }
                    }
                );
            } else {
                $("#update-msg").append(`
                    <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                        Unable to update profile: Incorrect current password provided.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);

                setTimeout(() => {
                    $("#update-msg").empty();
                }, 3000);
            }
        } else {
            $("#update-msg").append(`
                <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                    Unable to change password: Correct form fields
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#update-msg").empty();
            }, 3000);
        }
    });

    

    $("#new-password").blur(function (e) { 
        e.preventDefault();
        let newPassword = $("#new-password").val();
        let cnewPassword = $("#new-password").val();
        if (newPassword == '') {
            $("#pwMsg").text("This field is required");
            passStatus[0] = false;
        } else if (newPassword.length < 6 || newPassword.length > 32) {
            $("#pwMsg").text("Password must be between 6 to 32 characters");
            passStatus[0] = false;
        } else if (newPassword != '' && cnewPassword != '' && newPassword != cnewPassword) {
            $("#cpwMsg").text("Password does not match");
            passStatus[0] = false;
        } else {
            $("#pwMsg").text("");
            passStatus[0] = true;
        }
    });

    $("#cnewPassword").blur(function (e) { 
        e.preventDefault();
        let newPassword = $("#new-password").val();
        let cnewPassword = $("#cnewPassword").val();

        if (cnewPassword == '') {
            $("#cpwMsg").text("This field is required");
            passStatus[1] = false;
        } else if (cnewPassword.length < 6 ||cnewPassword.length > 32) {
            $("#cpwMsg").text("Password must be between 6 to 32 characters");
            passStatus[1] = false;
        } else if (newPassword != '' && cnewPassword != '' && newPassword != cnewPassword) {
            $("#cpwMsg").text("Password does not match");
            passStatus[1] = false;
        } else {
            $("#cpwMsg").text("");
            passStatus[1] = true;
        }
    });

    $("#old").blur(function (e) { 
        e.preventDefault();
        let oldPassword = $("#old").val();
        if (oldPassword == '') {
            $("#up-cur-msg").text("This field is required");
            passStatus[2] = false;
        } else if (oldPassword.length < 6 ||oldPassword.length > 32) {
            $("#up-cur-msg").text("Password must be between 6 to 32 characters");
            passStatus[2] = false;
        } else {
            $("#up-cur-msg").text("");
            passStatus[2] = true;
        }
    });

    $("#pass-submit").click(function (e) { 
        e.preventDefault();
        let isValid = passStatus.every((params) => params == true);

        if (isValid) {
            let password = $("#new-password").val();
            let curPassword = $("#old").val();
            if (curPassword == user.password) {
                

                $.ajax({
                    type: "patch",
                    url: `${userUrl}/${userID}`,
                    data: { password },
                    dataType: "json",
                    success: function (res) {
                        localStorage.setItem("update", 'password');
                        $(location).attr("href", '/user/dashboard.html');
                    }
                });
            } else {
                $("#pass-msg").append(`
                    <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                        Unable to change password: Incorrect Old password provided
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);

                setTimeout(() => {
                    $("#pass-msg").empty();
                }, 3000);
            }

        } else {
            $("#pass-msg").append(`
                    <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                        Unable to change password: Correct form fields
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `);

                setTimeout(() => {
                    $("#pass-msg").empty();
                }, 3000);
        }
        
        
    });
});