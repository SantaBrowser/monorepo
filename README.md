### Usage

Run in this order as apps depend on eachother and will fail if services are not fully started.

install node version 18.18.2
run command: yarn
create .env in root folder from .env.example
run command: yarn serve:docker
run command: yarn hardhat
create .env in apps/api/.env from .env.example
run command: yarn serve:api
create .env in apps/auth/.env from .env.example
run command: yarn serve:auth
