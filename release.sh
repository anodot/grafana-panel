#! /bin/bash
mv anodot-panel dist
yarn build
# export GRAFANA_API_KEY=<YOUR API KEY>
npx @grafana/toolkit plugin:sign
mv dist/ anodot-panel
zip anodot-panel-1.0.1.zip anodot-panel -r
md5 anodot-panel-1.0.1.zip> md5Checksum.txt
mv anodot-panel dist




