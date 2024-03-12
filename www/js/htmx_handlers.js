// Handle send errors
document.body.addEventListener("htmx:sendError", function (e) {
  // !TODO Handle send errors
});

// Handles response errors
document.body.addEventListener("htmx:responseError", function (e) {
  const id = e.target.id;
  const status = e.detail.xhr.status.toString();

  if (status.includes(5)) {
    document.getElementById(
      e.detail.requestConfig.headers["HX-Trigger"]
    ).innerHTML = "Service down";
  }
});
