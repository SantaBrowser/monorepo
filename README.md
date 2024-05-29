### Usage

Run in this order as apps depend on eachother and will fail if services are not fully started.

install node version 18.18.2

create .env in root folder from .env.example

create .env in apps/api/.env from .env.example

create .env in apps/auth/.env from .env.example

```bash
yarn
yarn serve:docker
yarn hardhat
yarn serve:api
yarn serve:auth
```
