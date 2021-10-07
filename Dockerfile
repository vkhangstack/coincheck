FROM node:alpine
LABEL maintainer="vkhangstack  <https://twitter.com/hx10r>"
COPY * /
RUN npm install

ENTRYPOINT ["/index.js"]
CMD []
