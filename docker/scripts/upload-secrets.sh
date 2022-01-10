#!/usr/bin/env bash

set -e

source ../.env
source ./utils.sh

UTILS_DIR="../../code/utils"

for domain in ziventi dev.ziventi; do
  scp \
    "$UTILS_DIR/.env" \
    "$UTILS_DIR/key.json" \
    "$SSH_USER"@"$SSH_ADDRESS":"/var/www/$domain/code/utils/"
done
