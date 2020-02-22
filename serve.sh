#!/usr/bin/env bash

git reset --hard
git pull
npm run build
pm2 start --name client express.js