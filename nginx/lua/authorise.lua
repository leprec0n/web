local cjson = require("cjson");
local response_body = ngx.ctx.resp_body;

local data = cjson.decode(response_body);
local keys = data["keys"];
local values = '';
for k, v in pairs(keys) do
    for key, value in pairs(v) do
        if type(value) == 'string' then
            values = values .. "\n" .. value;
        else
            for ke, val in pairs(value) do
                values = values .. "\n" .. val;
            end
        end
    end
end
-- ngx.log(ngx.WARN, values);

local jwt = require("resty.jwt")
local validators = require("resty.jwt-validators")
local jwt_obj = jwt:load_jwt("token")
ngx.log(ngx.WARN, "\n" .. cjson.encode(jwt_obj) .. "\n");
local cert = "verifierer"
local secret = "-----BEGIN CERTIFICATE-----\n$" .. cert .. "\n-----END CERTIFICATE-----\n";
local verified = cjson.encode(jwt:verify_jwt_obj(secret, jwt_obj, {
    valid_issuers = { "my-trusted-issuer", "my-other-trusteed-issuer" }
}));
ngx.log(ngx.WARN, "\n Is verified: " .. verified .. "\n");
-- local access_token = ''
-- for k, v in jwt_obj do
--     if type(v) == 'string' then
--         access_token = access_token .. "\n" .. v
--     end
-- end
-- ngx.log(ngx.WARN, access_token)
-- ngx.log(ngx.WARN, "\n" .. cjson.encode(jwt_obj) .. "\n");