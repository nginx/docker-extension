# NGINX Docker Desktop Extension


## Development
Before we can interactively develop the Extensions frontend, it must be installed first.

To build the extension
```shell
docker build -t nginx/nginx-dd-extension .
```
To install the extension
```shell
docker extension install nginx/nginx-dd-extension
```

To remove the extension
```shell
docker remove nginx/nginx-dd-extension
```

### Start Docker Extension Development Server
1. start the UI node server in the `ui` directory. Make sure you install the dev dependencies at the first.
```shell
npm install
npm run dev
```

2. enable debugging for the NGINX Docker Extension.
```shell
docker extension dev debug nginx/nginx-dd-extension 
```

```shell
docker extension dev ui-source nginx/nginx-dd-extension http://localhost:3000 
```