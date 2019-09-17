$(document).ready(function () {
    $("#logoutBtn").click(function (e) { 
        e.preventDefault();
        localStorage.removeItem('loggedUser');
        localStorage.setItem("isLogout", true)
        $(location).attr("href", '/login.html');
    });
});