#!/bin/bash

rm -rf android
rm -rf www

ionic build

ionic capacitor add android

ionic cap copy

ionic capacitor sync android

cp AndroidManifest.xml android/app/src/main/AndroidManifest.xml

ionic capacitor copy android --prod && cd android && ./gradlew assembleRelease && cd ..

ls android/app/build/outputs/apk/release
