import { getNewToken } from "./auth/auth0.mjs";

// Handle send errors
document.body.addEventListener("htmx:sendError", (e) => {
  // !TODO Handle send errors
});

// Handles general response errors
document.body.addEventListener("htmx:responseError", (e) => {
  const status = e.detail.xhr.status;
  const snackbar = document.getElementById("error-snackbar");

  if (status.toString().startsWith(5)) {
    document.getElementById(
      e.detail.requestConfig.headers["HX-Trigger"],
    ).innerHTML = "Service down";
  }

  if (status === 401) {
    getNewToken();
  }

  if (status.toString().startsWith(4)) {
    document.getElementById("error-message").innerHTML = e.detail.xhr.response;
    snackbar.classList.replace("hidden", "visible");
    handleSnackbar(snackbar);
  }
});

// !TODO Check if authorised request is made
document.body.addEventListener("htmx:confirm", (e) => {
  if (e.detail.path.includes(protectedEndpoints)) {
    e.preventDefault();

    getNewToken().then((tokens) => {
      e.detail.elt.bearer = tokens;

      e.detail.issueRequest();
    });
  }
});

// !TODO Check if authorised request is made
document.body.addEventListener("htmx:configRequest", async (e) => {
  const bearer = e.detail.elt.bearer;
  if (bearer) {
    e.detail.headers["Authorization"] = `Bearer ${bearer.access_token}`;
    e.detail.parameters["id_token"] = bearer.id_token.__raw;
  }
});

// On success
document.body.addEventListener("htmx:afterRequest", (e) => {
  if (e.detail.requestConfig.verb != "get") {
    const snackbar = document.getElementById("success-snackbar");

    document.getElementById("success-message").innerHTML =
      e.detail.xhr.response;
    snackbar.classList.replace("hidden", "visible");
    handleSnackbar(snackbar); // Handle in back-end
  }
});
