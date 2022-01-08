#!/usr/bin/env bash
set -e

cd /var/www/ziventi/
git checkout main
git pull origin main

./deploy.sh