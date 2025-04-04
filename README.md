[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/nginx/docker-extension/badge)](https://securityscorecards.dev/viewer/?uri=github.com/nginx/docker-extension)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Community Support](https://badgen.net/badge/support/community/cyan?icon=awesome)](/SUPPORT.md)
[![Community Forum](https://img.shields.io/badge/community-forum-009639?logo=discourse&link=https%3A%2F%2Fcommunity.nginx.org)](https://community.nginx.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/license/apache-2-0)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](/CODE_OF_CONDUCT.md)

# NGINX Docker Desktop Extension

![NGINX Docker Extension Instance Screen](docs/NGINX-dd-extension.png)

The NGINX Docker Desktop Extension can be used to manage the instance configuration of a running NGINX container.

## Development
Before we can interactively develop the Extensions frontend, it must be installed first.

To build the extension locally.
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
## Release

```shell
docker buildx build --push --no-cache --platform=linux/amd64,linux/arm64 -t nginx/nginx-docker-extension:0.0.1 .
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
## Community

- The go-to place to start asking questions and share your thoughts is
  our [Slack channel](https://community.nginx.org/joinslack).

- Get involved with the project by contributing! See the
  [contributing guide](CONTRIBUTING.md) for details.

- For security issues, [email us](security-alert@nginx.org), mentioning
  NGINX Unit in the subject and following the [CVSS
  v3.1](https://www.first.org/cvss/v3.1/specification-document) spec.


## Backlog

### Re-Expose new Ports
```shell
docker commit CONTAINERID NEWIMAGE
docker run NEWIMAGE -p ... -p.... -v POSSIBLE MOUNTS
```
### Export Configuration
Export configuration files from inside the container to a projects directory on the local computer
```shell
docker cp CONTAINERID:/etc/nginx/conf.d/test.conf ./something/....
```
## Contributing

Please see the [contributing guide](/CONTRIBUTING.md) for guidelines on how to best contribute to this project.

## License

[Apache License, Version 2.0](/LICENSE)

&copy; [F5, Inc.](https://www.f5.com/) 2023 - 2025
