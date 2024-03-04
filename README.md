# Leprecon
Leprecon is a gambling website written with [htmx](https://htmx.org/).

## Environment variables
In order to set the environment variables. You must first copy the `example.config.js` to `config.js`.
```bash
cp example.config.js config.js
```

Seeing as the application doesn't use node, the process.env global variable cannot be accessed. That is why there is a config.js.