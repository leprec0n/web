const protectedEndpoints = ["/account"]; // !TODO Change endpoint to /account

function login() {
  client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });
}

function logout() {
  client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
}

function loginState(loggedIn, nickname) {
  if (!loggedIn || !nickname) {
    return;
  }

  document.getElementById("logout").classList = "visible";
  document.getElementById("login").classList = "hidden invisible";
  document.getElementById("balance").classList = "visible";
  document.getElementById("username").innerText = nickname;
  document.getElementById("username").classList = "";
}

function handleSnackbar(id) {
  setTimeout(() => {
    document.getElementById(id).outerHTML = "";
  }, 5000);
}
