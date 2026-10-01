# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
frontend-handoff에 실제 전달되는 파일의 변경만 작성하세요.
프로젝트 서비스 페이지가 아닌 퍼블리싱 가이드 관련 파일은 [덮어쓰기]로 분류하세요.
지워야 하는 파일·화면은 [삭제]로 따로 적으세요.

## [Diff 확인]

### Header 반응형 개선
- 대상: src/components/composite/header.tsx
- 변경: 사용자 정보 영역 breakpoint 조정
- 결과: 768px 이상에서 사용자 정보 표시
- 커밋: [변경사항 보기](https://github.com/{organization}/{repository}/commit/{commit-hash})

## [신규 추가]

### EmailField 컴포넌트
- 대상: src/components/composite/email-field.tsx
- 적용: 신규 파일 추가

## [덮어쓰기]

### 문의 완료 화면
- 대상: src/components/custom/inquiry-complete
- 적용: 지정한 파일만 교체

컴포넌트 가이드 페이지는 `[페이지 제목](/component-guide/경로)` 형식으로 작성하면 새 창 링크로 표시됩니다.
릴리스 성공 후 내용은 자동으로 비워집니다.
-->

## [신규 추가]

### [에셋] 홈 공지 팝업 목업 그림

- 대상: public/images/home-notice/mock-notice-image-4x3.webp
    - public/images/home-notice/mock-notice-image-3x4.webp
    - public/images/home-notice/mock-notice-image-wide-16x9.webp
    - public/images/home-notice/mock-notice-image-tall-9x16.webp
- 적용: 신규 파일 추가
- 내용: 실제 서비스 그림이 아니라 공지 그림 칸의 비율을 확인하기 위한 예시입니다. 4x3 · 3x4 는 칸에 맞는 비율(960×720 · 960×1280)이고, wide-16x9 · tall-9x16 은 비율이 맞지 않는 그림이 어떻게 잘리는지 보이기 위한 그림입니다(잘리는 범위가 그림에 표시되어 있습니다).
- 참고: 실제 공지 그림으로 바꾸면 이 파일들은 지워도 됩니다. 단, 컴포넌트 가이드의 케이스가 이 그림을 쓰므로 가이드를 함께 쓰는 동안에는 남겨 둡니다.

## [Diff 확인]

### [컴포넌트] 분포 곡선 차트 — Safari PDF 저장 시 면이 단색으로 채워지던 문제

- 대상: src/components/custom/distribution-curve-chart.tsx
- 변경: 곡선 아래 면의 그라데이션에서 색 자리(stop)의 투명도를 없애고, 투명도 16%를 면 전체(fillOpacity)에 줍니다. 그라데이션은 곡선 색에서 표면색으로 갑니다.
- 결과: Safari 에서 인쇄 대화상자의 PDF 로 저장하면 면이 곡선 색 한 가지로 꽉 채워지고 그 뒤의 세로 점선과 점이 가려지던 문제가 없어집니다. Safari 는 PDF 로 저장할 때 색 자리에 준 투명도를 무시합니다(미리보기는 정상이라 저장해 봐야 드러납니다).
- 참고: 화면 모습은 그대로입니다. 표면 위에서는 두 방식이 같은 색으로 계산됩니다. 넘기는 값(props)도 바뀌지 않았습니다.
- 영향 화면: [분포 곡선 차트](/component-guide/distribution-curve-chart)
    - [기관 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/tech-index)
    - [기관 창업용 Tech-Index 심층분석](/org/mypage/evaluation-history/deep-analysis/startup-tech-index)
    - [기업 K-BIGx 기업혁신성장 보고서](/corp/k-bigx-report/innovation-growth-report/diagnostic-briefing)
    - [기관 K-BIGx 기업혁신성장 보고서](/org/k-bigx-report/innovation-growth-report/diagnostic-briefing)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/c4a7d90ec62108cab1f0f0b7135ad256938311a4)

### [컴포넌트] 홈 공지 팝업 — 카드형으로 다시 작성

- 대상: src/components/custom/home-notice-popup.tsx
    - src/content/service/home-notices.ts
    - src/app/(user-type)/corp/home-notice-popup/page.tsx
    - src/app/(user-type)/org/home-notice-popup/page.tsx
- 변경: 공지를 카드로 나란히 띄웁니다(모바일 1장 · 태블릿 2장 · PC 3장). 공지가 그보다 많으면 조작 줄이 나오고 5초마다 순환합니다. 공지는 최대 3건입니다.
    - 공지 데이터는 {id, title?, body?, image?} 입니다. category · summary · postedAt 은 없어졌습니다.
    - detailHref prop 이 없어졌습니다(두 page.tsx 에서 삭제). [자세히 보기] 링크와 체크박스도 없어졌습니다.
    - 그림만 있는 공지는 body 를 비웁니다. 그림의 대체 텍스트는 title 을 씁니다.
- 결과: [오늘 하루 보지않기]는 지금 창만 닫습니다. 숨김 기록은 onHideToday 에서 처리합니다(함수 prop 이라 클라이언트 컴포넌트로 감싸서 넘깁니다).
- 가이드: [홈 공지 팝업](/component-guide/home-notice-popup)
- 영향 화면: [기업 메인 공지사항 팝업](/corp/home-notice-popup)
    - [기관 메인 공지사항 팝업](/org/home-notice-popup)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/kibo-ktop/commit/87c329ae44a69b43a8fafb0a29e3d7d71f4f6369)

## [덮어쓰기]

### [문서] 컴포넌트 가이드 — 홈 공지 팝업 신규

- 대상: src/app/component-guide/(guide)/home-notice-popup
    - src/constants/publishing-guide.ts
- 적용: 지정한 파일만 교체
- 내용: 화면 폭별 구성 · 케이스 7개 · 엣지 케이스 8개 · 연동 방법 · 접근성 · Props 를 담았습니다. 케이스마다 [열기]를 누르면 그 구성으로 팝업이 뜹니다. 사이드 메뉴(피드백 / 오버레이)에 HomeNoticePopup 항목을 추가했습니다.
- 영향 화면: [홈 공지 팝업](/component-guide/home-notice-popup)
