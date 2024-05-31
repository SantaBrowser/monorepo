### Usage

### localhost

This repo requires 18.18.2 node version, it is mandatory to use only this version.

```bash
Terminal 1
./init.sh

./run.sh "yarn hardhat" # This will leave terminal busy with hardhat service

Terminal 2
./run.sh "yarn serve:auth" # This will leave terminal busy with auth service

Terminal 2
./run.sh "yarn serve:api" # This will leave terminal busy with api service

```
