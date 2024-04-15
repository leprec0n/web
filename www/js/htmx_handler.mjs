import { getNewToken } from "./auth/auth0.mjs";

// Handle send errors
document.body.addEventListener("htmx:sendError", (e) => {
  // !TODO Handle send errors
});

// Handles response errors
document.body.addEventListener("htmx:responseError", (e) => {
  const id = e.target.id;
  const status = e.detail.xhr.status;

  if (status.toString().includes(5)) {
    document.getElementById(
      e.detail.requestConfig.headers["HX-Trigger"],
    ).innerHTML = "Service down"; // !TODO Move to snackbar?
  }

  if (status === 401) {
    getNewToken();
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
