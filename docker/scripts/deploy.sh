#!/usr/bin/env bash
set -e

## Update the Ziventi project
cd /var/www/ziventi
git checkout deploy
git pull origin deploy

## Update nginx.conf
cp ./docker/nginx.conf /etc/nginx/sites-available/ziventi.conf
ln -s /etc/nginx/sites-available/ziventi.conf /etc/nginx/sites-enabled/

## Run the docker script
./docker/scripts/build-run.sh
