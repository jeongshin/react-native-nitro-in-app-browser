# 업스트림과 배포 기준

이 포크는 `@jeongshin/react-native-nitro-in-app-browser`로 배포해요.

- 업스트림: https://github.com/patrickkabwe/react-native-nitro-in-app-browser
- 소유 저장소: https://github.com/jeongshin/react-native-nitro-in-app-browser
- 기준 커밋: `1e76d03`(브랜치 `chore/upgrade-nitro-v35`)이에요. 업스트림 `v2.0.1`과 scoped `2.0.1` 배포본의 src·ios·android·nitrogen이 이 커밋과 같아요.
- 배포 버전: `2.0.3`이에요. Nitro/Nitrogen `0.37.2`, Nitro peer `>=0.37.2 <0.38.0`, RN 0.88.1·React 19.3 예제 기준이에요. 공개 open/close API와 네이티브 옵션 동작은 `2.0.1`과 같아요.
- npm의 scoped `2.0.2`에는 `android/src` 원본 5개가 없어요. Android 앱은 `2.0.3` 이상을 써요.

## 업스트림 대비 우리 변경

- 배포 이름과 주소: `package.json`의 `name`·`repository`·`bugs`·`homepage`·`publishConfig`, podspec `s.source`, README 설치 안내예요.
- Nitro 0.37.2: `nitrogen`·`react-native-nitro-modules` devDependency와 peer 범위, `nitrogen/generated` 재생성본이에요. 직접 쓴 src·ios·android 원본은 기준 커밋과 같아요.
- 포장: `files`의 `android/src/**/*`, `scripts/verify-package.mjs`, 두 플랫폼 CI의 포장 검증 단계예요.
- 개발 환경: Yarn 4.9.2(`packageManager`·`yarn.lock`·`.yarnrc.yml`), RN 0.88.1·React 19.3 예제, CI의 Node·Xcode 버전이에요.

## 반영하지 않은 업스트림 변경

- `v2.0.2`: `androidx.browser` 1.9.0, 라이브러리 `build.gradle`의 AGP classpath 9.0.1, spec의 `import type`, `engines.node`예요.
- `main`의 `829360c`(npm 미배포): Android에서 `pageSheet`·`formSheet`를 partial custom tab으로 여는 동작이에요.

둘 다 Android 의존성이나 화면 동작을 바꿔요. 앱 QA와 함께 별도 버전에서 반영해요.

## 변경을 반영할 때

업스트림 변경은 별도 브랜치에서 diff를 검토하고 적용해요. scope·repository·네이티브 namespace와 앱에서 쓰는 API를 유지해요. Nitro 버전을 바꾸면 devDependency와 Nitrogen 버전을 함께 맞추고 `yarn codegen`, `yarn typecheck`, `yarn pack`을 실행해요. `nitrogen/generated`는 생성기로 바꾸고 패키지에 포함해요.

Android 라이브러리는 rootProject의 NDK 값을 우선 사용하고 fallback은 27.1.12297006이에요. 예제에서도 모든 C++ 모듈의 NDK를 같은 root 값으로 맞춰요. RN0.88.1·React19.3 예제로 양 플랫폼 native 빌드를 검증해요.

## 발행 게이트

발행은 소유자가 로컬에서 직접 해요. `yarn build` → `yarn pack --out <tgz>` → `yarn verify:package <tgz>`를 통과한 tarball 파일 그대로 `npm publish <tgz> --tag latest --access public`으로 올리고, 발행 뒤 registry tarball이 그 파일과 같은지 대조해요. npm `latest`는 앱이 쓰는 버전을 가리켜요.

release workflow는 수동 실행·NPM_TOKEN 방식이고 semantic-release는 main/next만 허용해요. 이 호환 브랜치는 자동 발행 대상에 들어가지 않아요.
