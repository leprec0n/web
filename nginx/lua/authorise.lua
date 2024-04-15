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

  -- Check permissions
  if next(jwt.payload.permissions) == nil then
    ngx.log(ngx.WARN, "Empty permissions")
    return false
  end

  -- Create certificate
  local cert = "-----BEGIN CERTIFICATE-----\n" .. jwks["x5c"][1] .. "\n-----END CERTIFICATE-----\n"
  local openssl = require('openssl')
  local x509, err = openssl.x509.read(cert)
  local pk, err = x509:pubkey()  
  local pem, err = pk:export() -- Cannot use openssl because of crash when using verify method

  -- Get public key
  local resty_rsa = require("resty.rsa")
  local pub, err = resty_rsa:new({ public_key = pem, algorithm = "SHA256" })

  -- Split token into parts
  local parts = {}
  for part in token:gmatch("[^.]+") do
    table.insert(parts, part)
  end

  -- Verify token
  local b64 = require("ngx.base64")
  local verify, err = pub:verify(parts[1] .. "." .. parts[2], b64.decode_base64url(parts[3]))
  if not verify then
      ngx.log(ngx.WARN, "Unable to verify token!: " .. err)
      return false
  end

  return true
end

-- Verify jwt
if not valid_token(jwt, jwks) then
  ngx.exit(ngx.HTTP_UNAUTHORIZED)
end