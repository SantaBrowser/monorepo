#!/bin/bash
docker kill $(docker ps -q) && docker rmi -f $(docker images -aq)
docker volume rm $(docker volume ls -q --filter dangling=true)