#!/bin/bash
set -xe

mkdir certs || true
cd certs
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
cd ..

cp -f .env.example .env
cp apps/auth/.env.example apps/auth/.env
cp apps/app/.env.example apps/app/.env
cp apps/api/.env.example apps/api/.env

./run.sh echo
