# @jeongshin/react-native-nitro-in-app-browser

A Simple React Native Nitro module for in-app browser.

[![Build Android](https://github.com/patrickkabwe/react-native-nitro-in-app-browser/actions/workflows/android-build.yml/badge.svg)](https://github.com/patrickkabwe/react-native-nitro-in-app-browser/actions/workflows/android-build.yml)
[![Build iOS](https://github.com/patrickkabwe/react-native-nitro-in-app-browser/actions/workflows/ios-build.yml/badge.svg)](https://github.com/patrickkabwe/react-native-nitro-in-app-browser/actions/workflows/ios-build.yml)

[![npm version](https://img.shields.io/npm/v/react-native-nitro-in-app-browser.svg?style=flat-square)](https://www.npmjs.com/package/react-native-nitro-in-app-browser)
[![npm downloads](https://img.shields.io/npm/dm/react-native-nitro-in-app-browser.svg?style=flat-square)](https://www.npmjs.com/package/react-native-nitro-in-app-browser)

## Installation

> [!IMPORTANT]  
> This package requires `react-native-nitro-modules` to be installed first.
> See [react-native-nitro-modules](https://github.com/mrousavy/nitro) for more information.

```sh
yarn add @jeongshin/react-native-nitro-in-app-browser react-native-nitro-modules@0.37.2
cd ios && pod install && cd ..
```

## Usage

```js
import React from 'react';
import { Button, SafeAreaView } from 'react-native';
import NitroInAppBrowser from '@jeongshin/react-native-nitro-in-app-browser';

const App = () => {
  return (
    <SafeAreaView>
      <Button
        title="Open Nowie Tech"
        onPress={() => {
          try {
            await NitroInAppBrowser.open('https://nowietech.com', {
              barColor: 'purple',
              controlColor: '#000000',
              dismissButtonLabel: 'close',
              presentationStyle: 'fullScreen',
            });
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default App;
```

## License

MIT

---

Bootstrapped with [Create Nitro Modules](https://github.com/patrickkabwe/create-nitro-module)

## Credits

This package is based on the [react-native-nitro-modules](https://github.com/mrousavy/nitro) package.

## 배포 파일 검증

배포 후보는 `yarn build` 뒤 `yarn pack --out /tmp/browser-package.tgz`로 만들고 `yarn verify:package /tmp/browser-package.tgz`로 확인해요. 검증기는 실제 tarball의 Android 필수 등록 파일, Git에 추적된 native/runtime 원본의 포함·내용, JS/타입 진입점과 React Native CLI의 Android 자동 연결을 검사해요.

`files`의 중첩 디렉터리는 `android/src/**/*`처럼 하위 파일 패턴을 명시해요. Yarn 4.9.2는 `android/src`만 적으면 이 경로의 원본을 포장에 넣지 않아요. 소스 checkout의 예제 빌드와 tarball 내부 파일끼리의 일치만으로 배포 파일의 완전성을 판단하지 않아요. 두 플랫폼 CI가 실제 포장 검증을 먼저 실행하고, 발행 전에는 해당 tarball을 소비한 앱의 native 빌드와 첫 기동도 확인해요.
