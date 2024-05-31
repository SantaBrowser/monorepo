#!/bin/bash
docker kill $(docker ps -q) && docker rmi -f $(docker images -aq) || true
docker volume rm $(docker volume ls -q --filter dangling=true) || true