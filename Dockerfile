# Use the official Node.js LTS image
# See all versions at https://hub.docker.com/_/node
FROM node:lts AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && npm i

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json drizzle.config.ts drizzle /temp/prod/
RUN cd /temp/prod && npm i --only=production

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
#RUN npm test
RUN npm run build

# Copy production dependencies and source code into final image
FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/drizzle.config.ts .
COPY --from=prerelease /usr/src/app/drizzle ./drizzle

RUN mkdir -p /data && touch /data/shrt-container.db
RUN chown -R node:node /data
ENV DATABASE_URL=/data/shrt-container.db

# Run the app
USER node
EXPOSE 3000/tcp
ENTRYPOINT npx drizzle-kit migrate --config=drizzle.config.ts && node ./index.js
