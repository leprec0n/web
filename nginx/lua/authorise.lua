-- Get token
local cjson = require("cjson");
local headers= ngx.req.get_headers()
local token = "";

for k, v in pairs(headers) do
  if k == "authorization" then
    token = v:gsub("Bearer ", "");
  end
end

-- Get jwks
local res = ngx.location.capture("/_validate_token") -- Makes internal request to auth0 jwks endpoint
local resp_body = res.body

local data = cjson.decode(resp_body);
local keys = data["keys"];
local jwks = keys[1];

-- Load jwt
local resty_jwt = require("resty.jwt")
-- local validators = require("resty.jwt-validators")
local jwt = resty_jwt:load_jwt(token)

local function valid_token(jwt, jwks)
  -- Check if valid
  if jwt.valid ~= true then
    ngx.log(ngx.WARN, "Invalid token!")
    return false
  end

  -- Check header values
  if jwt.header.kid ~= jwks.kid or jwt.header.alg ~= jwks.alg or jwt.header.typ ~= "JWT" then
    ngx.log(ngx.WARN, "Invalid header value!")
    return false
  end

  -- Check expiry date
  if jwt.payload.exp <= os.time() then
    ngx.log(ngx.WARN, "Token expired!")
    return false
  end

  return true
end

-- Verify jwt
if not valid_token(jwt, jwks) then
  ngx.exit(ngx.HTTP_UNAUTHORIZED)
end


-- local cert = "verifierer"
-- local secret = "-----BEGIN CERTIFICATE-----\n$" .. cert .. "\n-----END CERTIFICATE-----\n";
-- local verified = cjson.encode(jwt:verify_jwt_obj(secret, jwt_obj, {
--     valid_issuers = { "my-trusted-issuer", "my-other-trusteed-issuer" }
-- }));
-- ngx.log(ngx.WARN, "\n Is verified: " .. verified .. "\n");
-- local access_token = ''
-- for k, v in jwt_obj do
--     if type(v) == 'string' then
--         access_token = access_token .. "\n" .. v
--     end
-- end
-- ngx.log(ngx.WARN, access_token)
-- ngx.log(ngx.WARN, "\n" .. cjson.encode(jwt_obj) .. "\n");