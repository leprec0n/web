import { getToken, getUserClaims } from "./auth/auth0.mjs";

// Handle send errors
document.body.addEventListener("htmx:sendError", (e) => {
  // !TODO Handle send errors
});

// Handles general response errors
document.body.addEventListener("htmx:responseError", (e) => {
  const status = e.detail.xhr.status;

  if (status.toString().startsWith(5)) {
    document.getElementById(
      e.detail.requestConfig.headers["HX-Trigger"],
    ).innerHTML = "Service down";
  }
});

// !TODO Check if authorised request is made
document.body.addEventListener("htmx:confirm", async (e) => {
  if (isProtectedEndpoint(e.detail.path)) {
    e.preventDefault();

    let token = await getToken();

    if (token) {
      e.detail.elt.bearer = token;
      e.detail.issueRequest();
    }
  }
});

// !TODO Check if authorised request is made
document.body.addEventListener("htmx:configRequest", async (e) => {
  const bearer = e.detail.elt.bearer;
  const user = getUserClaims();
  if (bearer && user) {
    e.detail.headers["Authorization"] = `Bearer ${bearer}`;
    e.detail.parameters["sub"] = user.sub;

    if (e.detail.path === "/email/verification") {
      e.detail.parameters["email_verified"] = user.email_verified;
    }
  }
});

// On success
document.body.addEventListener("htmx:afterRequest", (e) => {
  const snackbar = document.getElementById("snackbar");
  const status = e.detail.xhr.status;

  if (
    e.detail.requestConfig.verb == "delete" &&
    e.detail.pathInfo.requestPath == "/user" &&
    status.toString().startsWith(2)
  ) {
    logout();
  }

  if (e.detail.requestConfig.verb != "get") {
    if (status.toString().startsWith(2)) {
      const id = `succes-snackbar-${Math.floor(Math.random() * 10000)}`;
      e.detail.target.childNodes[e.detail.target.childNodes.length - 1].id = id;
      handleSnackbar(id);
    }

    if (status.toString().startsWith(4) && status !== 401) {
      const id = `error-snackbar-${Math.floor(Math.random() * 10000)}`;
      snackbar.insertAdjacentHTML("beforeend", e.detail.xhr.response);
      snackbar.childNodes[snackbar.childNodes.length - 1].id = id;
      handleSnackbar(id);
    }
  }
});
