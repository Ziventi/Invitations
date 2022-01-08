#!/usr/bin/env bash
set -e

cd /var/www/ziventi/
git checkout deploy
git pull origin deploy

cd code/
docker/scripts/build-run.sh
