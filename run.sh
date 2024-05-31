#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm install 18.18.2
nvm use 18.18.2
npm install -g yarn

yarn

source ~/.santa-thx-keys || true

$1
