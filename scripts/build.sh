#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

version=$(bun -e 'console.log(require("./manifest.json").version)')
out="dist/makes-mistakes"

rm -rf dist
mkdir -p "$out"
cp manifest.json "$out/"
cp -R src "$out/"

(cd dist && zip -qr "makes-mistakes-$version.zip" makes-mistakes)

# Same archive under a version-less name: /releases/latest/download only resolves a
# fixed filename, so this is what the landing page can link to directly.
cp "dist/makes-mistakes-$version.zip" dist/makes-mistakes.zip

echo "unpacked  dist/makes-mistakes"
echo "zip       dist/makes-mistakes-$version.zip"
echo "stable    dist/makes-mistakes.zip"
