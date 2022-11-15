#!/usr/bin/env sh

# abort on errors
set -e

# build
pnpm run build-test

# navigate into the build output directory
cd test/dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

rm -rf .git

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/dilan-dio4/use-safe-async-mount.git main:gh-pages

cd -

# sudo chmod +x ./deploy.sh
