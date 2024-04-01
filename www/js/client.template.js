const client = new auth0.Auth0Client({
  domain: "${AUTH_HOST}",
  clientId: "${CLIENT_ID}",
  useRefreshTokens: true,
  cacheLocation: "localstorage",
  authorizationParams: {
    redirect_uri: window.location.origin,
    max_age: 1700,
  },
});
