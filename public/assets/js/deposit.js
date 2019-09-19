$(document).ready(function () {
    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let isValid = false;
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";
    let user;
    $.get(`${userUrl}/${userID}`,
        function (res) {
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.lastName}`);
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
        } else if (amount < 100 || amount > 1000000) {
            $("#amtMsg").html("Amount must be between &#8358;100 - &#8358;1000000");
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
                type: "deposit",
                userID,
                balance:  parseInt(user.balance) + parseInt(amount),
                amount,
                date: Date.now()
            }
            
            $.post(transUrl, data,
                function () {
                    $.ajax({
                        type: "patch",
                        url: `${userUrl}/${userID}`,
                        data: {balance:  parseInt(user.balance) + parseInt(amount)},
                        dataType: "json",
                        success: function (res) {
                            let details = {type: 'deposit', amount: amount}
                            localStorage.setItem("trans", JSON.stringify(details));
                            $(location).attr("href", '/user/dashboard.html');
                        }
                    });
                }
            );
        } else {
            $("#msg-holder").append(`
                <div class="alert alert-danger alert-dismissible fade show m-2 p-2 text-center">
                    Transaction Failed: Enter Amount to deposit.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msg-holder").empty();
            }, 3000);
        }
    });
});