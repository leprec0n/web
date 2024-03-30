const client = new auth0.Auth0Client({
  domain: "", // !TODO Read through environment variables.
  clientId: "", // !TODO Read through environment variables.
  useRefreshTokens: true,
  cacheLocation: "localstorage",
  authorizationParams: {
    redirect_uri: window.location.origin,
    max_age: 1700,
  },
});

await updateUI();

const query = window.location.search;
if (query.includes("code=") && query.includes("state=")) {
  await client.handleRedirectCallback();
  history.replaceState({}, "", "/");
  await updateUI();
}

document.getElementById("login").addEventListener("click", async () => {
  login();
});

document.getElementById("logout").addEventListener("click", async () => {
  logout();
});

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

async function updateUI() {
  const isAuthenticated = await client.isAuthenticated();

  if (!isAuthenticated) {
    loginState(false);
  } else {
    loginState(true);
    setUserProfile(await client.getUser());
  }
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
  console.log(userProfile);
  document.getElementById("username").innerText = userProfile.nickname;
  document.getElementById("username").classList = "";
}
