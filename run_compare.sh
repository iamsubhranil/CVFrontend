#!/bin/bash

rm -rf part*.png
rm -rf screenshot_*.png

npx live-server src --port=8000 &
pid=$!
sleep 2
node src/takeScreenshot.cjs
convert -append part*.png screenshot_old.png
rm -rf part*.png
node src/fillContent.js > src/index2.html
pushd src
node postprocess.cjs > index.html
popd
sleep 2
node src/takeScreenshot.cjs nocache
kill $pid
git checkout HEAD -- src/index.html
convert -append part*.png screenshot_new.png
rm -rf part*.png
result=$(compare -metric RMSE screenshot_old.png screenshot_new.png diff.png 2>&1)
echo "Difference: $result"
rmse=$(echo "$result" | cut -d' ' -f1)
if [ "$rmse" -ne '0' ]; then
  echo "Images do not match! Failing the job."
  exit 1
fi