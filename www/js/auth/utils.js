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

function loginState(loggedIn) {
  if (loggedIn) {
    document.getElementById("logout").classList = "visible";
    document.getElementById("login").classList = "hidden invisible";
  } else {
    document.getElementById("login").classList = "visible";
    document.getElementById("logout").classList = "hidden invisible";
  }
}

function setUserProfile(userProfile) {
  document.getElementById("username").innerText = userProfile.nickname;
  document.getElementById("username").classList = "";
}

function handleSnackbar(snackbar) {
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("visible", "hidden");
  }, 5000);
}
