$(document).ready(function () {
    
    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";
    let user;

    $.get(`${userUrl}/${userID}`,
        function (res) {
            localStorage.setItem("response", JSON.stringify(res));
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.lastName}`);
            getAll(res)
        }
    );
    
    setTimeout(() => {
        user = JSON.parse(localStorage.getItem("response"));
        localStorage.removeItem('response');
    }, 1000);

    $("#filter-history").change(function (e) { 
        e.preventDefault();
        let selectedFilter = $("#filter-history").val();
        if (selectedFilter == "deposit") {
            $.get(`${transUrl}`,
                function (transRes) {
                    let deposits = transRes.filter((elem) => elem.userID == userID && elem.type == 'deposit');
                    $("#all-history-tbody").empty();
                    deposits.forEach((el, i) => {
                            $("#all-history-tbody").append(`
                            <tr class="table-striped">
                                <td>${i + 1}</td>
                                <td>${el.amount}</td>
                                <td>${el.balance}</td>
                                <td>${el.type}</td>
                                <td>${new Date(parseInt(el.date)).toUTCString()}</td>
                            </tr>
                        `);
                    });
                }
            );
            
        } else if (selectedFilter == "withdraw") {
            $.get(`${transUrl}`,
                function (transRes) {
                    let withdrawals = transRes.filter((elem) => elem.userID == userID && elem.type == 'withdrawal');
                    $("#all-history-tbody").empty();
                    withdrawals.forEach((el, i) => {
                            $("#all-history-tbody").append(`
                            <tr class="table-striped">
                                <td>${i + 1}</td>
                                <td>${el.amount}</td>
                                <td>${el.balance}</td>
                                <td>${el.type}</td>
                                <td>${new Date(parseInt(el.date)).toUTCString()}</td>
                            </tr>
                        `);
                    });
                }
            );
        } else {
            location.reload()
        }
    });
    


    function getAll(res) {
        $.get(`${transUrl}`,
                function (transRes) {
                    let allTrans = transRes.filter((elem) => elem.userID == userID);
                    if (!allTrans.length) {
                        $("#history").empty();
                        $("#history").append(`
                            <div class="jumbotron jumbo-border ">
                                <p class="text-center text-capitalize top-text1">No transaction history availbale</p>
                                <a href="/user/deposit.html" class="btn btn-block btn-success">Make first deposit now</a>
                            </div>
                        `);
                    } else {
                        allTrans.forEach((el, i) => {
                            if (el.type == 'deposit') {
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