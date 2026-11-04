# 업스트림과 배포 기준

이 포크는 `@jeongshin/react-native-nitro-in-app-browser`로 배포해요.

- 업스트림: https://github.com/patrickkabwe/react-native-nitro-in-app-browser
- 소유 저장소: https://github.com/jeongshin/react-native-nitro-in-app-browser
- 앱이 쓰는 배포본: scoped `2.0.1`, npm gitHead `1e76d03ad598ca87eaddedef2162f1053a92f679`예요.
- 기준 브랜치: `chore/upgrade-nitro-v35`예요. 해당 커밋의 src·ios·android·nitrogen은 배포 tarball과 같아요. 배포본에서만 달랐던 package name/version/publishConfig를 소유 manifest에 반영해요.
- 이번 후보: `2.0.2`, Nitro/Nitrogen `0.37.2`, Nitro peer `>=0.37.2 <0.38.0`예요. 공개 open/close API와 네이티브 옵션 동작은 유지해요.

## 변경을 반영할 때

업스트림 변경은 별도 브랜치에서 diff를 검토하고 적용해요. scope·repository·네이티브 namespace와 앱에서 쓰는 API를 유지해요. Nitro 버전을 바꾸면 devDependency와 Nitrogen 버전을 함께 맞추고 `yarn codegen`, `yarn typecheck`, `yarn pack`을 실행해요. `nitrogen/generated`는 생성기로 바꾸고 패키지에 포함해요.

Android 라이브러리는 rootProject의 NDK 값을 우선 사용하고 fallback은 27.1.12297006이에요. 예제에서도 모든 C++ 모듈의 NDK를 같은 root 값으로 맞춰요. RN0.88.1·React19.3 예제로 양 플랫폼 native 빌드를 검증해요.

## 발행 게이트

현재 release workflow는 수동 실행·NPM_TOKEN 방식이고 semantic-release는 main/next만 허용해요. 이 호환 브랜치는 자동 발행 대상이 아니에요. scoped package의 토큰 권한 또는 trusted publishing 설정을 확인한 뒤 소유자의 발행 지시로만 배포해요. 공개 패키지를 만드는 workflow 실행과 npm publish, 릴리스 태그 push는 이 호환성 작업에 포함하지 않아요.
