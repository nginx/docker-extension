FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
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
LABEL org.opencontainers.image.title="NGINX Docker Desktop Extension" \
    org.opencontainers.image.description="NGINXs Docker Desktop Extension" \
    org.opencontainers.image.vendor="NGINX Inc." \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.extension.screenshots="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.changelog=""

COPY metadata.json .
COPY logo.svg .
COPY --from=client-builder /ui/build ui
