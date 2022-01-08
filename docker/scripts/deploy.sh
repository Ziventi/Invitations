#!/usr/bin/env bash
set -e

cd /var/www/ziventi
git checkout deploy
git pull origin deploy

./docker/scripts/build-run.sh
