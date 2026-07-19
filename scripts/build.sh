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

echo "unpacked  dist/makes-mistakes"
echo "zip       dist/makes-mistakes-$version.zip"
