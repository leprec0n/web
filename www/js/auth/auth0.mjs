import {
  checkAccessExpired,
  checkAlreadyVerified,
  checkLoginCode,
  checkSuccessfulVerification,
} from "./query_handler.mjs";

await getNewToken();
await updateUI();

const timeDelay = 300000; // 5 minutes in miliseconds
const query = new URL(document.location).searchParams;
let tokenRateLimit = 0;

if (query.size !== 0) {
  checkLoginCode(query);
  checkAlreadyVerified(query);
  checkSuccessfulVerification(query);
  checkAccessExpired(query);
}

export async function getNewToken() {
  try {
    if (Date.now() >= tokenRateLimit) {
      const access_token = await client.getTokenSilently({ cacheMode: "off" });
      tokenRateLimit = Date.now() + timeDelay;
      return {
        access_token: access_token,
        id_token: await client.getIdTokenClaims(),
      };
    } else {
      return {
        access_token: await client.getTokenSilently(),
        id_token: await client.getIdTokenClaims(),
      };
    }
  } catch (e) {
    if (e.toString() == "Error: Unknown or invalid refresh token.") {
      logout();
      login();
    }
  }
}

export async function updateUI() {
  const isAuthenticated = await client.isAuthenticated();

  if (!isAuthenticated) {
    loginState(false);
  } else {
    const userProfile = await client.getUser();
    verificationState(userProfile);
    loginState(true);

    setUserProfile(userProfile);
  }
}

async function verificationState(userProfile) {
  document.getElementById("send-verification-mail").classList =
    "hidden invisible";
  if (userProfile === null || userProfile.email_verified) {
    return;
  }

  document.getElementById("verified").innerText =
    "Check email to verify account."; // !TODO Email resend functionality.
  document.getElementById("send-verification-mail").classList = "visible";
}

document.getElementById("login").addEventListener("click", async () => {
  login();
});

document.getElementById("logout").addEventListener("click", async () => {
  logout();
});
