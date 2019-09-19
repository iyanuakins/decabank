if(!!localStorage.getItem('loggedUser')) {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    let loggedTime = loggedUser.timeStamp;
    let now = Date.now();
    if(loggedTime - now < 0) {
        localStorage.removeItem('loggedUser')
    } else{
        let data = { userID: loggedUser.userID, timeStamp: Date.now() + 10800000}
        localStorage.setItem("loggedUser", JSON.stringify(data));
        window.location = "/user/dashboard.html";
    }
}
