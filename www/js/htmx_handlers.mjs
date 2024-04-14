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

document.body.addEventListener("htmx:confirm", (e) => {
  e.preventDefault();

  getNewToken().then((token) => {
    e.detail.elt.bearer = `Bearer ${token}`;
    e.detail.issueRequest();
  });
});

document.body.addEventListener("htmx:configRequest", async (event) => {
  if (event.detail.elt.bearer) {
    event.detail.headers["Authorization"] = event.detail.elt.bearer;
  }
});
