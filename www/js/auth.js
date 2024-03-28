if (location.search.includes("state=") && location.search.includes("code=")) {
  const urlParams = new URLSearchParams(window.location.search);
  const state = urlParams.get("state");
  const code = urlParams.get("code");

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/token");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  var data = "grant_type=authorization_code";

  xhr.send(data);
} else if (location.search.includes("error=")) {
  // !TODO Handle error
}

//history.replaceState({}, "", "/");
