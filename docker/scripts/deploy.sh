#!/usr/bin/env bash
set -e

## Update the Ziventi project
cd /var/www/ziventi
git checkout main
git pull origin main

## Update nginx.conf
NGINX_CONF="/etc/nginx/sites-available/ziventi.co.uk.conf"
cp ./docker/nginx.conf ${NGINX_CONF}
ln -sf ${NGINX_CONF} /etc/nginx/sites-enabled/
sudo nginx -t

## Run the docker script
./docker/scripts/build-run.sh
