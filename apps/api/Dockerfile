#####################################################################################################
## Develop stage
#####################################################################################################
FROM node:18-slim AS develop

WORKDIR /usr/src/app

ENV NODE_OPTIONS="--max_old_space_size=8192"

RUN apt-get update && apt-get install -y g++ make python3-pip build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

COPY package.json yarn.lock ./
RUN yarn
RUN yarn add sharp --ignore-engines
COPY . .

CMD [ "npx", "nx", "serve", "api" ]

#####################################################################################################
## Build stage
#####################################################################################################
FROM node:18-slim AS build

WORKDIR /usr/src/app
COPY --from=develop ./usr/src/app/ ./
RUN npx nx build api --prod
COPY ./newrelic.js ./yarn.lock ./dist/apps/api/

#####################################################################################################
## Production stage
#####################################################################################################
FROM node:18-slim AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY --from=build ./usr/src/app/dist/apps/api/package.json ./usr/src/app/dist/apps/api/yarn.lock  ./

# Install dependencies and packages
RUN apt-get update && apt-get install -y \
    g++ \
    make \
    python3-pip \
    build-essential \ 
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

# Install your application dependencies (assuming it uses Node.js)
RUN yarn
RUN yarn add sharp --ignore-engines

# Clean up unnecessary packages and files
RUN apt-get purge -y --auto-remove build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build ./usr/src/app/dist/apps/api ./

CMD [ "main.js" ]