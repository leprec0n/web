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
ngx.log(ngx.WARN, values);

local jwt = require("resty.jwt")
local jwt_obj = jwt:load_jwt("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdlYWtPdDMxbi1jS044OU9WbW1ISCJ9.eyJpc3MiOiJodHRwczovL2Rldi0wbjh4YnN5aXA3b20zdmF2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NjBkOGY1YzQzMzJhZWVjMzgyNmEzMmQiLCJhdWQiOlsiaHR0cDovLzEyNy4wLjAuMTo4MCIsImh0dHBzOi8vZGV2LTBuOHhic3lpcDdvbTN2YXYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcxMjczODQ2MCwiZXhwIjoxNzEyNzM5MzYwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIiwiYXpwIjoiSnVEYW82M3AwQnRIOVcydXVUbFpJeGZnbExUNVdVUnQiLCJwZXJtaXNzaW9ucyI6W119.LIS9BSM8Y1dgRl3Z-LhmMeT9U6FiovBdJDiocA-SA08MHFEhaJQ3Ye7szchGEnNmTlsCkXAVOQE4h-3P4XlsVwa5QR2CWUEY8W2fAel7841CYsirKsc5VBNcX5mFJ2P8CKqi_g-V-kxG5QhrVoo3XXZ9GdbMcs58EZ3oWRHx9nSO0Zw1uqjFofIU7QADMtWmaCsVU9xy6_OV9o24vg0ulhdRowk7xE2q-QsrUuJgfpZUFzGnMBjAZEfloTcSqcw4GtWJnHOtwrCqHeCvPGfrAfc2iIA5rbl3VAgLOM2jp7c0aSzdBfR4HJ9-Juld9eji4hKsCLapkDOiD-UfSRBSFQ")
local access_token = ''
-- for k, v in jwt_obj do
--     if type(v) == 'string' then
--         access_token = access_token .. "\n" .. v
--     end
-- end
-- ngx.log(ngx.WARN, access_token)
ngx.log(ngx.WARN, "\n" .. cjson.encode(jwt_obj) .. "\n");