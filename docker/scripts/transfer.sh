#!/usr/bin/env bash
set -e

scp -o StrictHostKeyChecking=no -r ./docker/scripts/* "${SSH_USER}"@"${SSH_ADDRESS}":/home/circleci/scripts/
ssh -o StrictHostKeyChecking=no -v "${SSH_USER}"@"${SSH_ADDRESS}" ./scripts/deploy.sh