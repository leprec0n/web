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

let userProfile = null;
let token = null;
try {
  token = await client.getTokenSilently({ cacheMode: "off" });
} catch (e) {
  if (e.toString() == "Error: Unknown or invalid refresh token.") {
    logout();
    login();
  }

  console.log(e);
}
await updateUI();

const query = new URL(document.location).searchParams;

if (query.size !== 0) {
  checkLoginCode(query);
  checkAlreadyVerified(query);
  checkSuccessfulVerification(query);
  checkAccessExpired(query);
}

document.getElementById("login").addEventListener("click", async () => {
  login();
});

document.getElementById("logout").addEventListener("click", async () => {
  logout();
});

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
  document.getElementById("send-verification-mail").classList =
    "hidden invisible";
  if (userProfile === null || userProfile.email_verified) {
    return;
  }

  if (userProfile.email_verified) {
    return;
  }

  document.getElementById("verified").innerText =
    "Check email to verify account."; // !TODO Email resend functionality.
  document.getElementById("send-verification-mail").classList = "visible";
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

function checkAccessExpired(query) {
  if (
    query.get("message") === "Access expired." &&
    query.get("success") === "false"
  ) {
    // !TODO Show expired verification link
    history.replaceState({}, "", "/");
  }
}

document.body.addEventListener("htmx:configRequest", async (e) => {
  // evt.detail.parameters["id"] = userProfile.sub;
  // e.detail.headers["Authorization"] = `Bearer ${token}`;
  // e.detail.headers["Content-Type"] = `application/x-www-form-urlencoded`;
  e.detail.headers["Accept-Encoding"] = "gzip";
});
