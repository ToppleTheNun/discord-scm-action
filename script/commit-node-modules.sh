#!/usr/bin/env sh

rm -rf node_modules
sed -i '/node_modules/d' .gitignore # Bash command that removes node_modules from .gitignore
yarn install --frozen-lockfile --production
git add node_modules .gitignore
git commit -m "chore(release): add node_modules"
