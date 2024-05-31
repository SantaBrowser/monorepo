#!/bin/bash
set -xe

mkdir certs ||
cd certs
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
cd ..

cp -f .env.localhost .env
cp apps/auth/.env.localhost apps/auth/.env
cp apps/api/.env.localhost apps/api/.env

./run.sh echo
./run.sh "yarn serve:docker"
