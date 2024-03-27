// const hash = window.location.hash.substring(1);
// if (hash !== "") {
//   const result = hash.split("&").reduce((prev, item) => {
//     const parts = item.split("=");
//     prev[parts[0]] = parts[1];
//     return prev;
//   }, {});

//   console.log(result);
//   //document.cookie = `access_token=${result.access_token};max-age=${result.expires_in}`;
// }
// console.log(document.cookie);
// history.replaceState(history.state, "", "http://127.0.0.1");

auth0
  .createAuth0Client({
    domain: "",
    clientId: "",
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  })
  .then(async (client) => {
    //redirect to the Universal Login Page
    document.getElementById("login").addEventListener("click", async (e) => {
      e.preventDefault();
      await client.loginWithRedirect();
    });

    if (
      location.search.includes("state=") &&
      (location.search.includes("code=") || location.search.includes("error="))
    ) {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }

    // Assumes a button with id "logout" in the DOM
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      client.logout();
    });

    const isAuthenticated = await client.isAuthenticated();
    const userProfile = await client.getUser();

    // Assumes an element with id "profile" in the DOM
    const profileElement = document.getElementById("profile");

    if (isAuthenticated) {
      profileElement.style.display = "block";
      profileElement.innerHTML = `
            <p>${userProfile.nickname}</p>
          `;
    } else {
      profileElement.style.display = "none";
    }
  });
