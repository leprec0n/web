import config from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
    var dynamicButton = document.getElementById("content");
    var baseUrl = config.apiUrl;
    var path = "/";
    dynamicButton.setAttribute("hx-get", baseUrl + path);
});
