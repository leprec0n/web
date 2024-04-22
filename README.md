# Leprecon

Leprecon is a gambling website using [htmx](https://htmx.org/), tailwind, and vanilla js.

## Requirements

- Docker

### optional

- Node (dev dependencies)

## Nginx/Openresty

Nginx is used as the web server to serve static content to the client. The following command can be run to start the server.

```bash
./run.bash
```

The image used is openresty, which makes it easy to use Lua.

## Environment

The environment variables are located inside `example.env`, and should be copied to a `.env`.
