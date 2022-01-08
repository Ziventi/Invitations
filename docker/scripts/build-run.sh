#!/usr/bin/env bash
set -e

IMAGE_NAME=ziventi
CONTAINER_NAME=ziventi-server
PORT=4000

echo 'Building Ziventi image...'
if
  docker build -f "docker/Dockerfile" \
  -t $IMAGE_NAME \
  --build-arg PORT=$PORT \
  .;
then
  echo 'Successfully Ziventi image.'
else
  echo 'Failed to Ziventi image'
  echo 'Aborting.'
  exit 1
fi

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Destroying $CONTAINER_NAME container..."
  docker stop $CONTAINER_NAME >/dev/null
  docker rm $CONTAINER_NAME >/dev/null
fi

echo 'Running container...'
docker run --detach \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  --publish $PORT:$PORT \
  --env PORT=$PORT \
  $IMAGE_NAME
