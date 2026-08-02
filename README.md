# Frontend handoff

현재 저장소의 검증을 통과한 프론트엔드 실행 소스입니다. 프로젝트 화면과 컴포넌트는 원본 배포와 같은 코드를 사용합니다.

- 전달 버전: v0.1.9
- 원본 브랜치: handoff-test
- 원본 커밋: 4b5ca71ecc05776a07cb2a75fa454663151508fa
- 생성 시각: 2026-08-02T21:45:01+09:00

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

## 디자인 토큰

`src/app/tokens.css`는 검증된 초기 결과물로 포함됩니다. `tokens.json`을 수정한 뒤 `yarn tokens`로 다시 생성할 수 있으며, `yarn dev`와 `yarn build` 실행 전에도 자동으로 갱신됩니다.
