# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock drizzle.config.ts drizzle /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
#RUN bun test
RUN bun --bun run build

# copy production dependencies and source code into final image
FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/drizzle.config.ts .
COPY --from=prerelease /usr/src/app/drizzle ./drizzle

RUN mkdir -p /data && touch /data/shrt-container.db
RUN chown -R bun:bun /data
ENV DATABASE_URL=/data/shrt-container.db
RUN

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT bun drizzle-kit migrate --config=drizzle.config.ts && bun ./index.js
