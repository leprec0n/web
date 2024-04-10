const client = new auth0.Auth0Client({
  domain: "${AUTH_HOST}",
  clientId: "${CLIENT_ID}",
  useRefreshTokens: true,
  cacheLocation: "localstorage",
  authorizationParams: {
    audience: "http://127.0.0.1:80",
    redirect_uri: window.location.origin,
    max_age: 1700,
  },
});
