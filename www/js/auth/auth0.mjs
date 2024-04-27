import {
  checkAccessExpired,
  checkAlreadyVerified,
  checkLoginCode,
  checkSuccessfulVerification,
} from "./query_handler.mjs";

let userClaims = null;

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

export async function getTokens() {
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
  const claims = await client.getUser();

  if (!isAuthenticated) {
    loginState(false, null);
  } else {
    setUserClaims(claims);
    verificationState(claims.email_verified);
    loginState(true, claims.nickname);
  }
}

function setUserClaims(claims) {
  userClaims = claims;
}

export function getUserClaims() {
  if (userClaims) {
    return userClaims;
  }

  return null;
}

async function verificationState(email_verified) {
  if (email_verified) {
    return;
  }

  document.getElementById("email-verified").classList = "bg-pink-300 visible";
}
