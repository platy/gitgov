FROM node:10-alpine as build

RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
rm /var/cache/apk/*

WORKDIR /build
COPY package* ./
RUN npm install
COPY *.config.js *.json ./
COPY src ./src
RUN npm run build

RUN git config --global user.email "test@example.com"
RUN git config --global user.name "Test runner"
COPY test ./test
RUN npm test


FROM node:10-alpine

RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
rm /var/cache/apk/*

WORKDIR /app
EXPOSE 25
ENV PORT 25
ENV REPODIR /repo
CMD node server.js
RUN git config --global user.email "info@gov.uk"
RUN git config --global user.name "UK Government"

COPY package* ./
RUN npm install --only=production
COPY --from=build /build/dist/ ./
