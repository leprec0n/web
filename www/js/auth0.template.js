const client = new auth0.Auth0Client({
  domain: "${AUTH_HOST}",
  clientId: "${CLIENT_ID}",
  useRefreshTokens: true,
  cacheLocation: "localstorage",
  authorizationParams: {
    redirect_uri: window.location.origin,
    max_age: 1700,
  },
});

let userProfile = null;
await updateUI();

const query = new URL(document.location).searchParams;

if (query.size !== 0) {
  checkLoginCode(query);
  checkAlreadyVerified(query);
  checkSuccessfulVerification(query);
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
    userProfile = await client.getUser();
    verificationState();
    loginState(true);
    console.log(userProfile);
    console.log(await client.getIdTokenClaims());

    setUserProfile(userProfile);
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
  document.getElementById("username").innerText = userProfile.nickname;
  document.getElementById("username").classList = "";
}

async function verificationState() {
  if (userProfile === null || userProfile.email_verified) {
    return;
  }

  await client.getTokenSilently({ cacheMode: "off" });
  userProfile = await client.getUser();

  if (userProfile.email_verified) {
    return;
  }

  document.getElementById("verified").innerText =
    "Check email to verify account."; // !TODO Email resend functionality.
}

async function checkLoginCode(query) {
  if (query.get("code") && query.get("state")) {
    await client.handleRedirectCallback();
    history.replaceState({}, "", "/");
    await updateUI();
  }
}

function checkAlreadyVerified(query) {
  if (
    query.get("message") === "This URL can be used only once" &&
    query.get("success") === "false"
  ) {
    // !TODO Show message already verified
    history.replaceState({}, "", "/");
  }
}

function checkSuccessfulVerification(query) {
  if (
    query.get("supportSignUp") === "true" &&
    query.get("supportForgotPassword") === "true" &&
    query.get("message") ===
      "Your email was verified. You can continue using the application." &&
    query.get("success") === "true" &&
    query.get("code") === "success"
  ) {
    // !TODO Show message verification successfull
    history.replaceState({}, "", "/");
  }
}
