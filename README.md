### Usage

### localhost

This repo requires 18.18.2 node version, it is mandatory to use only this version.

All api keys located inside next files:
`./apps/auth/src/app/config/secrets.ts`
`./apps/app/src/config/secrets.ts`
`./apps/api/src/app/config/secrets.ts`
Environments can be configured via env vars or .env files. 
For localhost we have `.env.localhost` files which copied as `.env` files to be used

```bash
#Terminal 1
./init.sh
./run.sh "yarn hardhat" # This will leave terminal busy with hardhat service

#Terminal 2
./run.sh "yarn serve:auth" # This will leave terminal busy with auth service

#Terminal 3
./run.sh "yarn serve:api" # This will leave terminal busy with api service

```
