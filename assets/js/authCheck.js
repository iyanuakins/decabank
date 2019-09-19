if(!!localStorage.getItem('loggedUser')) {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    let loggedTime = loggedUser.timeStamp;
    let now = Date.now();
    if(loggedTime - now < 0) {
        localStorage.removeItem('loggedUser');
        window.location ="/login.html"
    }
} else {
    window.location = "/login.html";
}
