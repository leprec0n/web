# Leprecon

Leprecon is a gambling website written with [htmx](https://htmx.org/).

## Nginx

Nginx is used as the web server to serve static content to the client. The following command can be run to start the server.

```bash
docker compose up -d
```

> Remove the -d if you want to see the container logs

## Building

Building the project can be done using the following command:

```bash
docker build -t jarnoweemen/leprecon:{version}-web .
```

> Change {version} to the next version following sementics (e.g., 1.0.0)
