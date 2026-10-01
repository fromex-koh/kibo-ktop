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
