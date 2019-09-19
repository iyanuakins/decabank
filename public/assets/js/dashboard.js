$(document).ready(function () {
    if(!!localStorage.getItem('trans')) {
        let trans = JSON.parse(localStorage.getItem('trans'));
        if(trans.type == "deposit") {
            localStorage.removeItem('trans');
            $("#msg-holder").append(`
                <div class="alert alert-success alert-dismissible fade show m-2 p-2" id="msgBox">
                    Deposit of &#8358;${trans.amount} was succesful
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msgBox").remove();
            }, 3000);
        } else if(trans.type == "withdraw") {
            localStorage.removeItem('trans');
            $("#msg-holder").append(`
                <div class="alert alert-success alert-dismissible fade show m-2 p-2" id="msgBox">
                    Withdrawal of &#8358;${trans.amount} was succesful.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msgBox").remove();
            }, 3000);
        }
    }

    if(!!localStorage.getItem('update')) {
        let update = localStorage.getItem('update');
        if(update == "password") {
            localStorage.removeItem('update');
            $("#msg-holder").append(`
                <div class="alert alert-success alert-dismissible fade show m-2 p-2" id="msgBox">
                    Password was successfully changed.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msgBox").remove();
            }, 3000);
        } else if(update == "profile") {
            localStorage.removeItem('update');
            $("#msg-holder").append(`
                <div class="alert alert-success alert-dismissible fade show m-2 p-2" id="msgBox">
                    Profile was successfully updated.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msgBox").remove();
            }, 3000);
        }
    }
    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";

    $.get(`${userUrl}/${userID}`,
        function (res) {
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.lastName}`);
            $("#acc-bal").html(`&#8358;${res.balance}`);
            getAll(res)
            $.get(`${transUrl}`,
                function (transRes) {
                    let deposits = transRes.filter((elem) => elem.userID == userID && elem.type == 'deposit');
                    let withdrawals = transRes.filter((elem) => elem.userID == userID && elem.type == 'withdrawal');
                    (!withdrawals.length) ? $("#tot-with").html(`&#8358;0`) : $("#tot-with").html(`&#8358;${withdrawals.reduce((acc, elem) => acc + parseInt(elem.amount), 0)}`);
                    (!deposits.length) ? $("#tot-dep").html(`&#8358;0`) : $("#tot-dep").html(`&#8358;${deposits.reduce((acc, elem) => acc + parseInt(elem.amount), 0)}`);
                }
            );
        }
    );
    
    function getAll(res) {
        $.get(`${transUrl}`,
                function (transRes) {
                    transRes = transRes.reverse()
                    let allTrans = transRes.filter((elem) => elem.userID == userID);
                    if(!allTrans.length){
                        $("#last-five").empty();
                        $("#last-five").append(`
                            <div class="jumbotron jumbo-border ">
                                <p class="text-center text-capitalize top-text1">No transaction history availbale</p>
                                <a href="/user/deposit.html" class="btn btn-block btn-success">Make first deposit now</a>
                            </div>
                        `);
                        
                    } else {
                        let lastFiveTrans = allTrans.splice(0, 5).reverse()
                        lastFiveTrans.forEach((el, i) => {
                            if(el.type == 'deposit'){
                                $("#all-history-tbody").append(`
                                <tr class="bg-success">
                                    <td>${i + 1}</td>
                                    <td>${el.amount}</td>
                                    <td>${el.balance}</td>
                                    <td>${el.type}</td>
                                    <td>${new Date(parseInt(el.date)).toUTCString()}</td>
                                </tr>
                            `);
                            } else {
                                $("#all-history-tbody").append(`
                                    <tr class="bg-danger">
                                        <td>${i + 1}</td>
                                        <td>${el.amount}</td>
                                        <td>${el.balance}</td>
                                        <td>${el.type}</td>
                                        <td>${new Date(parseInt(el.date)).toUTCString()}</td>
                                    </tr>
                                `);
                            }
                        });
                    }

                }
            );
    }
});