import {
  checkAccessExpired,
  checkAlreadyVerified,
  checkLoginCode,
  checkSuccessfulVerification,
} from "./query_handler.mjs";

window.onload = async () => {
  const query = new URL(document.location).searchParams;

  await getTokens();
  await updateUI();

  if (query.size !== 0) {
    checkLoginCode(query);
    checkAlreadyVerified(query);
    checkSuccessfulVerification(query);
    checkAccessExpired(query);
  }
};

export async function getTokens(force) {
  try {
    return {
      access_token: await client.getTokenSilently(),
      id_token: await client.getIdTokenClaims(),
    };
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
  if (userProfile === null || userProfile.email_verified) {
    return;
  }

  document.getElementById("email-verified").classList = "bg-pink-300 visible";
}
