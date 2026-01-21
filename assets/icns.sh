#!/usr/bin/env sh

# Create icns file from 512x512 png for macOS app icon
sips -z 16 16     icon.512.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.512.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.512.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.512.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.512.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.512.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.512.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.512.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.512.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.512.png --out icon.iconset/icon_512x512@2x.png

iconutil -c icns icon.iconset -o icon.icns

# Create ico file from png for Windows app icon
magick icon.512.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
