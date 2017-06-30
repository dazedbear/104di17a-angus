#!/bin/bash
IMG_NAME="di-eval-test"

if [ "$#" -ne 2 ] ; then
    echo "Usage: $0 [REPO] [BRANCH]"
    exit 1
fi

docker build -t "$IMG_NAME" -f dockerfiles/verify --build-arg repo="$1" --build-arg branch="$2" . && docker run -it --rm "$IMG_NAME" && docker rmi "$IMG_NAME"
