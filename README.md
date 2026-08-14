# Frontend handoff

현재 저장소의 검증을 통과한 프론트엔드 실행 소스입니다. 프로젝트 화면과 컴포넌트는 원본 배포와 같은 코드를 사용합니다.

## 버전 이력

최신 전달본이 위에 표시됩니다. 각 행에서 전달 버전, 원본 브랜치와 커밋, 생성 시각을 확인할 수 있습니다.

| 버전 | 원본 브랜치 | 원본 커밋 | 생성 시각 |
| --- | --- | --- | --- |
| v2.0.4 | main | `40a6d382b1136dce8db70f49887fd0a17a5107e8` | 2026-08-14T08:40:56Z |
| v2.0.3 | main | `cc3d72fbf70eeab41ba3c22adc9501cfb34d43ec` | 2026-08-14T04:11:11Z |
| v2.0.2 | main | `cc49907e4981aa54692c3c6e8f55528fb2c49a62` | 2026-08-13T23:30:37Z |
| v2.0.1 | main | `d868da01e2e3db578ec45d26ab8df6553ee0d0d7` | 2026-08-12T23:25:09Z |
| v2.0.0 | main | `cdcc6a2165ed6909cb4ebe056636a6a562297047` | 2026-08-11T23:30:16Z |
| v1.0.1 | main | `053da8ea8eeac721b4756638e6581caaecc4c157` | 2026-08-06T01:18:45Z |
| v1.0.0 | main | `7ec83fd01a129d54a0fc9d4b4fe69e025ceef44b` | 2026-08-05T08:25:58Z |
| v0.1.10 | main | `8c3414ac546400cdb221715ce6488e65be1e1e5f` | 2026-08-03T00:36:40Z |

## 실행

```bash
yarn install --frozen-lockfile
yarn dev
```

프로덕션 빌드는 `yarn build`, 실행은 `yarn start`를 사용합니다. 전달 이후의 코드 스타일, 브랜치 전략, Lint와 포맷 정책은 프론트엔드 저장소에서 관리합니다.

## 주요 경로

- `/`: 서비스 메인 화면으로 교체할 최소 시작 페이지
- `/publishing-guide`: 원본 저장소의 퍼블리싱 인덱스
- `/component-guide`: 컴포넌트 가이드

## 사이트 메타데이터

`src/constants/site.ts`는 handoff 전용 사이트명, 설명, URL과 저장소 URL을 관리합니다. handoff 생성 전에는 저장소의 `handoff/site.ts`를 수정합니다.

OG 이미지 경로는 `/og-image.png`로 유지하며, 디자인 작업 완료 후 `handoff/og-image.png`를 추가하면 자동으로 적용됩니다.

## 디자인 토큰

`src/app/tokens.css`는 검증된 초기 결과물로 포함됩니다. `tokens.json`을 수정한 뒤 `yarn tokens`로 다시 생성할 수 있으며, `yarn dev`와 `yarn build` 실행 전에도 자동으로 갱신됩니다.
