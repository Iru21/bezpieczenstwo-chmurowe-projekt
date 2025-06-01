#!/bin/bash

sudo rm -rf ./db-volume
docker compose up --build $@