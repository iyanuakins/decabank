if(!!localStorage.getItem('loggedUser')) {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    let loggedTime = loggedUser.timeStamp;
    let now = Date.now();
    if(loggedTime - now < 0) {
        localStorage.removeItem('loggedUser');
        $(location).attr("href", '/login.html');
    }
} else {
    $(location).attr("href", '/login.html');
}

$(document).ready(function () {
    if(!!localStorage.getItem('deposited')) {
        let deposited = JSON.parse(localStorage.getItem('deposited'));
        if(deposited == "true") {
            $("#msg-holder").html(`
                div class="alert alert-success alert-dismissible fade show m-2 p-2">
                    Deposit Succesful
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);

            setTimeout(() => {
                $("#msg-holder").html('');
            }, 5000);
        }
    }

    let userID = JSON.parse(localStorage.getItem('loggedUser')).userID
    let userUrl = "http://localhost:3000/users";
    let transUrl = "http://localhost:3000/transactions";

    $.get(`${userUrl}/${userID}`,
        function (res) {
            $("#name-holder").html(`<i class="fas fa-user"></i> ${res.firstName} ${res.lastName}`);
            
        }
    );
    

});