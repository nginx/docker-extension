FROM --platform=$BUILDPLATFORM node:20.11-alpine3.18 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="NGINX Development Center" \
    org.opencontainers.image.description="NGINX Development Center for Docker Desktop" \
    org.opencontainers.image.vendor="NGINX Inc." \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.extension.screenshots='[{"alt":"NGINX Docker Development Center", "url":"https://raw.githubusercontent.com/nginx/docker-extension/main/docs/NGINX-dd-extension.png"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/nginx/docker-extension/main/logo.svg"\
    com.docker.extension.detailed-description="With the NGINX Docker Development Center you are able to configure your running NGINX Docker Instances." \
    com.docker.extension.publisher-url="https://github.com/nginx/docker-extension/" \
    com.docker.extension.additional-urls='[{"title":"Support", "url":"https://github.com/nginx/docker-extension/issues"}]' \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Bugfix: Fixed several dark mode rendering issues"

COPY metadata.json .
COPY logo.svg .
COPY --from=client-builder /ui/build ui