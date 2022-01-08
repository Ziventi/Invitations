#!/usr/bin/env bash
set -e

## Update the Ziventi project
cd /var/www/ziventi
git checkout deploy
git pull origin deploy

## Update nginx.conf
cp ./docker/nginx.conf /etc/nginx/sites-available/ziventi.co.uk.conf
ln -s /etc/nginx/sites-available/ziventi.co.uk.conf /etc/nginx/sites-enabled/
nginx -t

## Run the docker script
./docker/scripts/build-run.sh
