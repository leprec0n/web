-- Get token
local headers= ngx.req.get_headers()
local api_key = "";

for k, v in pairs(headers) do
  if k == "authorization" then
    api_key = v:gsub("Bearer ", "");
  end
end

if api_key ~= ngx.var.api_key then
  ngx.exit(ngx.HTTP_UNAUTHORIZED)
end