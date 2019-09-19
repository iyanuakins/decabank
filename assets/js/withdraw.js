$(document).ready(function () {
    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let isValid = false;
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";
    let user;
    $.get(`${userUrl}/${userID}`,
        function (res) {
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.lastName}`);
            $("#max").val("₦" +res.balance);
            $("#fullName").val(`${res.firstName} ${res.lastName}`);
            localStorage.setItem("response", JSON.stringify(res));
        }
    );

    setTimeout(() => {
        user = JSON.parse(localStorage.getItem("response"));
        localStorage.removeItem('response');
    }, 1000);

    $("#amount").blur(function (e) { 
        e.preventDefault();
        let amount = $("#amount").val();
        let amtExp = /\d+/;
        let isAmt = amtExp.test(amount);
        if (amount == '') {
            $("#amtMsg").html("This field is required");
            isValid = false;
        } else if (!isAmt) {
            $("#amtMsg").html("Amount must be in Numbers only");
            isValid = false;
        } else if (amount < 1000 || amount > 1000000) {
            $("#amtMsg").html("Amount must be between &#8358;1000 - &#8358;1000000");
            isValid = false;
        } else if (amount > parseInt(user.balance)) {
            $("#amtMsg").html(`You can not withdramal more than ${user.balance}`);
            isValid = false;
        } else {
            $("#amtMsg").html("");
            isValid = true;
        }
    });


    $("#submit").click(function (e) { 
        e.preventDefault();
        if (isValid) {
           
            let amount = $("#amount").val();
            
            let data = {
                type: "withdrawal",
                userID,
                balance:  parseInt(user.balance) - parseInt(amount),
                amount,
                date: Date.now()
            }

            let newUserData = {
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                email: user.email,
                balance:  parseInt(user.balance) - parseInt(amount), 
                password: user.password,
                date: user.date
            }
            
            
            $.post(transUrl, data,
                function () {
                    $.ajax({
                        type: "put",
                        url: `${userUrl}/${userID}`,
                        data: newUserData,
                        dataType: "json",
                        success: function (res) {
                            let details = {type: 'withdraw', amount: amount}
                            localStorage.setItem("trans", JSON.stringify(details));
                            $(location).attr("href", '/user/dashboard.html');
                        }
                    });
                }
            );
        } else {
            alert("One or more fields is/are wrong, please correct and resubmit")
        }
    });
});